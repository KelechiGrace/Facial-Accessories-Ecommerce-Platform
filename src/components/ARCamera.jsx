import React, { useRef, useEffect, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// ── Per-glasses calibration ──
const glassesConfig = {
  "glasses-aviator":    { widthMult: 2.5, heightMult: 0.70, yOffset: 0 },
  "glasses-rectangle":  { widthMult: 2.4, heightMult: 0.60, yOffset: 2 },
  "glasses-round":      { widthMult: 2.1, heightMult: 0.69, yOffset: 0 },
  "glasses-cat":        { widthMult: 2.3, heightMult: 0.59, yOffset: -4 },
  "glasses-wayfarer":   { widthMult: 2.2, heightMult: 0.59, yOffset: 2 },
  default:              { widthMult: 2.2, heightMult: 0.60, yOffset: 0 },
};
const getGlassesConfig = (type) => {
  if (!type) return glassesConfig.default;
  const key = Object.keys(glassesConfig).find((k) => type.includes(k.replace("glasses-", "")));
  return glassesConfig[key] || glassesConfig.default;
};

// ── Lipstick colour map ──
const lipColours = {
  "lipstick-red":       "rgba(170,20,30,0.55)",
  "lipstick-pink":      "rgba(188,80,120,0.50)",
  "lipstick-chocolate": "rgba(123,63,0,0.50)",
  "lipstick-tangerine": "rgba(242,133,0,0.50)",
  "lipstick-wine":      "rgba(128,0,32,0.55)",
  "lipstick-nude":      "rgba(196,154,120,0.50)",
  default:              "rgba(170,20,30,0.52)",
};
const getLipColour = (type) => {
  if (!type) return lipColours.default;
  const key = Object.keys(lipColours).find((k) => type.includes(k.replace("lipstick-", "").replace("lipstick", "")));
  return lipColours[key] || lipColours.default;
};

// ─────────────────────────────────────────────────────────────
// EARRING VISIBILITY
// ─────────────────────────────────────────────────────────────
// All in RAW camera space (lm.x: 0=cam-left, 1=cam-right, NOT mirrored)
// Canvas is mirrored so:  cam-left → screen-RIGHT,  cam-right → screen-LEFT
//
// LM 234 = cam-LEFT  ear  →  screen-RIGHT
// LM 454 = cam-RIGHT ear  →  screen-LEFT
//
// ratioLeft  = (nose.x - lEdge.x) / faceW   ← share of face to the LEFT of nose
// ratioRight = (rEdge.x - nose.x) / faceW   ← share of face to the RIGHT of nose
//
// Turn LEFT  (in real world / as you see in mirror):
//   nose moves toward cam-LEFT edge → ratioLeft gets SMALL
//   cam-RIGHT ear (LM 454 / screen-LEFT) is now HIDDEN behind head
//   cam-LEFT  ear (LM 234 / screen-RIGHT) faces camera → SHOW screen-RIGHT only ✓
//
// Turn RIGHT (in real world / as you see in mirror):
//   nose moves toward cam-RIGHT edge → ratioRight gets SMALL
//   cam-LEFT  ear (LM 234 / screen-RIGHT) is now HIDDEN behind head
//   cam-RIGHT ear (LM 454 / screen-LEFT) faces camera → SHOW screen-LEFT only ✓

const getVisibleEars = (lm) => {
  const nose  = lm[1];
  const lEdge = lm[234];
  const rEdge = lm[454];
  if (!nose || !lEdge || !rEdge) return { showScreenLeft: true, showScreenRight: true };

  const faceW = rEdge.x - lEdge.x;
  if (faceW < 0.01) return { showScreenLeft: true, showScreenRight: true };

  const ratioLeft  = (nose.x - lEdge.x) / faceW;
  const ratioRight = (rEdge.x - nose.x) / faceW;

  const HIDE = 0.15; // only hide when truly turned away

  return {
    // screen-LEFT  = LM 454 (cam-right ear) — hidden when face turns LEFT  (ratioLeft small)
    showScreenLeft:  ratioLeft  > HIDE,
    // screen-RIGHT = LM 234 (cam-left  ear) — hidden when face turns RIGHT (ratioRight small)
    showScreenRight: ratioRight > HIDE,
  };
};

// ─────────────────────────────────────────────────────────────
const ARCamera = ({ product }) => {
  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const landmarkerRef = useRef(null);
  const animFrameRef  = useRef(null);
  const glassesImg    = useRef(new Image());
  const earringImg    = useRef(new Image());
  const streamRef     = useRef(null);

  const [status, setStatus] = useState("Starting camera…");

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setStatus("Loading AR model…");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
        });
        if (cancelled) { landmarker.close(); return; }
        landmarkerRef.current = landmarker;

        setStatus("Starting camera…");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;

        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        if (product?.type?.includes("glasses") && product.image_url) {
          await new Promise((res) => {
            glassesImg.current.crossOrigin = "anonymous";
            glassesImg.current.src = product.image_url;
            glassesImg.current.onload = res;
            glassesImg.current.onerror = res;
          });
        }
        if (product?.type?.includes("earring") && product.image_url) {
          await new Promise((res) => {
            earringImg.current.crossOrigin = "anonymous";
            earringImg.current.src = product.image_url;
            earringImg.current.onload = res;
            earringImg.current.onerror = res;
          });
        }

        setStatus(null);
        renderLoop();
      } catch (err) {
        console.error("AR init error:", err);
        setStatus("Camera error — please allow camera access and refresh.");
      }
    };

    const renderLoop = () => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !landmarkerRef.current) return;

      const ctx = canvas.getContext("2d");
      canvas.width  = video.videoWidth  || 640;
      canvas.height = video.videoHeight || 480;
      const W = canvas.width;
      const H = canvas.height;
      const mx = (x) => W - x * W;

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -W, 0, W, H);
      ctx.restore();

      const result = landmarkerRef.current.detectForVideo(video, performance.now());
      const lm     = result?.faceLandmarks?.[0];

      if (lm) {
        const type = product?.type || "";

        // ── GLASSES ──
        if (type.includes("glasses") && glassesImg.current.complete && glassesImg.current.naturalWidth) {
          const L  = lm[33];
          const R  = lm[263];
          const x1 = mx(L.x), y1 = L.y * H;
          const x2 = mx(R.x), y2 = R.y * H;
          const dist   = Math.hypot(x2 - x1, y2 - y1);
          const cfg    = getGlassesConfig(type);
          const width  = dist * cfg.widthMult;
          const height = width * cfg.heightMult;
          const cx     = (x1 + x2) / 2;
          const cy     = (y1 + y2) / 2 + cfg.yOffset;
          const angle  = Math.atan2(y2 - y1, x2 - x1);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.scale(1, -1);
          ctx.drawImage(glassesImg.current, -width / 2, -height / 2, width, height);
          ctx.restore();
        }

        // ── LIPSTICK ──
        if (type.includes("lipstick")) {
          const upperIdx = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
          const lowerIdx = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
          ctx.save();
          ctx.beginPath();
          upperIdx.forEach((i, idx) => {
            const p = lm[i];
            if (!p) return;
            idx === 0 ? ctx.moveTo(mx(p.x), p.y * H) : ctx.lineTo(mx(p.x), p.y * H);
          });
          [...lowerIdx].reverse().forEach((i) => {
            const p = lm[i];
            if (!p) return;
            ctx.lineTo(mx(p.x), p.y * H);
          });
          ctx.closePath();
          ctx.fillStyle = getLipColour(type);
          ctx.fill();
          ctx.restore();
        }

        // ── EARRINGS ──
        if (type.includes("earring") && earringImg.current.complete && earringImg.current.naturalWidth) {
          const img    = earringImg.current;
          const aspect = img.naturalHeight / img.naturalWidth;

          const xScreenLeft  = W - lm[454].x * W;
          const xScreenRight = W - lm[234].x * W;
          const faceW        = Math.abs(xScreenRight - xScreenLeft);
          const faceCenterX  = (xScreenLeft + xScreenRight) / 2;

          const size        = faceW * 0.18;
          const lobeDrop    = faceW * 0.10;
          const outwardPush = faceW * 0.04;

          const { showScreenLeft, showScreenRight } = getVisibleEars(lm);

          if (showScreenLeft) {
            const earX  = xScreenLeft;
            const earY  = lm[454].y * H;
            const drawX = earX + (earX < faceCenterX ? -outwardPush : outwardPush);
            ctx.drawImage(img, drawX - size / 2, earY + lobeDrop, size, size * aspect);
          }

          if (showScreenRight) {
            const earX  = xScreenRight;
            const earY  = lm[234].y * H;
            const drawX = earX + (earX > faceCenterX ? outwardPush : -outwardPush);
            ctx.drawImage(img, drawX - size / 2, earY + lobeDrop, size, size * aspect);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close();
    };
  }, [product]);

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {status && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(247,247,251,0.92)", borderRadius: "16px", zIndex: 10,
          flexDirection: "column", gap: "12px",
          fontFamily: "'Inter', sans-serif", fontSize: "14px",
          color: "#7c3aed", fontWeight: 500,
        }}>
          <div style={{
            width: "36px", height: "36px",
            border: "3px solid #e0d6f5", borderTopColor: "#7c3aed",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          {status}
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ borderRadius: "10px", width: "100%", maxWidth: "640px" }} />
    </div>
  );
};

export default ARCamera;