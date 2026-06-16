import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import SellerLayout from "./SellerLayout";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function SellerDashboard() {
  const [products, setProducts]           = useState([]);
  const [arStats, setArStats]             = useState([]);
  const [bodyTypeStats, setBodyTypeStats] = useState([]);
  const [activities, setActivities]       = useState([]);
  const [measurements, setMeasurements]   = useState([]);
  const [measSearch, setMeasSearch]       = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json()).then(setProducts).catch(console.error);

    fetch("http://localhost:5000/ar-stats")
      .then(res => res.json()).then(setArStats).catch(console.error);

    fetch("http://localhost:5000/analytics/body-types")
      .then(res => res.json()).then(setBodyTypeStats).catch(console.error);

    fetch("http://localhost:5000/activity-log")
      .then(res => res.json()).then(setActivities).catch(console.error);

    // ── Load all measurements for the table ──
    fetch("http://localhost:5000/measurements/export")
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) setMeasurements(data);
    else setMeasurements([]);
  })
  .catch(() => setMeasurements([]));
  }, []);

  // ── Summary numbers ──
  const totalProducts   = products.length;
  const totalTryOns     = arStats.reduce((sum, i) => sum + i.try_on_count, 0);
  const totalCartAdds   = arStats.reduce((sum, i) => sum + (i.added_to_cart_after_ar || 0), 0);
  const mostViewed      = [...arStats].sort((a, b) => b.try_on_count - a.try_on_count)[0];
  const topBodyType     = bodyTypeStats[0];
  const totalUsers      = bodyTypeStats.reduce((sum, b) => sum + b.count, 0);

  // ── Chart data ──
  const cartAddData = {
    labels: arStats.map(s => `Product ${s.product_id}`),
    datasets: [{
      label: "AR Try-Ons",
      data: arStats.map(s => s.try_on_count),
      backgroundColor: "#6A0DAD",
    }],
  };

  const arImpactData = {
    labels: ["AR Try-Ons", "No Interaction"],
    datasets: [{
      data: [totalTryOns, totalProducts * 5 - totalTryOns || 1],
      backgroundColor: ["#6A0DAD", "#E5E7EB"],
    }],
  };

  const bodyTypeChartData = {
    labels: bodyTypeStats.map(b =>
      b.body_type ? b.body_type.charAt(0).toUpperCase() + b.body_type.slice(1) : ""
    ),
    datasets: [{
      data: bodyTypeStats.map(b => b.count),
      backgroundColor: ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"],
    }],
  };

  // ── CSV Export ──
  const handleExportCSV = () => {
    if (!measurements.length) {
      alert("No measurement data to export yet.");
      return;
    }

    const headers = [
      "Email", "Height (cm)", "Weight (kg)",
      "Bust (cm)", "Waist (cm)", "Hips (cm)",
      "Body Type", "Date Submitted"
    ];

    const rows = measurements.map(m => [
      m.email || "",
      m.height || "",
      m.weight || "",
      m.bust   || "",
      m.waist  || "",
      m.hips   || "",
      m.body_type || "",
      m.updated_at ? new Date(m.updated_at).toLocaleString() : "",
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `assistmart-measurements-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Filtered measurements for table search ──
  const filteredMeasurements = measurements.filter(m =>
    (m.email || "").toLowerCase().includes(measSearch.toLowerCase()) ||
    (m.body_type || "").toLowerCase().includes(measSearch.toLowerCase())
  );

  const bodyTypeEmoji = {
    pear: "🍐", hourglass: "⌛", inverted_triangle: "🔺", rectangle: "▭", apple: "🍎"
  };

  return (
    <SellerLayout>
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Seller Dashboard</h1>

      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Products"    value={totalProducts} />
        <StatCard title="AR Try-Ons"  value={totalTryOns}   />
        <StatCard title="Cart Adds"   value={totalCartAdds} />
        <StatCard
          title="Top Product"
          value={mostViewed ? `Product ${mostViewed.product_id}` : "No data"}
        />
      </div>

      {/* ── AR CHARTS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="mb-4 font-semibold">AR Try-Ons per Product</h2>
          <Bar data={cartAddData} />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="mb-4 font-semibold">AR Engagement</h2>
          <Doughnut data={arImpactData} />
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-3">Recent Activity</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {activities.length === 0 && (
            <li className="text-gray-400">No activity recorded yet.</li>
          )}
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
              {activity.action}
            </li>
          ))}
        </ul>
      </div>

      {/* ══════════════════════════════════════════════
          USER ANALYTICS SECTION
      ══════════════════════════════════════════════ */}
      <div className="mt-10">

        {/* Header row with export button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-purple-700">User Analytics</h2>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Measurements CSV
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded shadow border-l-4 border-purple-500">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Most Common Body Type
            </p>
            <p className="text-2xl font-bold text-purple-700 capitalize">
              {topBodyType
                ? `${bodyTypeEmoji[topBodyType.body_type] || ""} ${topBodyType.body_type}`
                : "No data yet"}
            </p>
            {topBodyType && (
              <p className="text-xs text-gray-400 mt-1">
                {topBodyType.count} out of {totalUsers} users
              </p>
            )}
          </div>

          <div className="bg-white p-5 rounded shadow border-l-4 border-violet-400">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Users Measured
            </p>
            <p className="text-2xl font-bold text-purple-700">{totalUsers}</p>
            <p className="text-xs text-gray-400 mt-1">Submitted body measurements</p>
          </div>

          <div className="bg-white p-5 rounded shadow border-l-4 border-indigo-400">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Body Type Variety
            </p>
            <p className="text-2xl font-bold text-purple-700">{bodyTypeStats.length}</p>
            <p className="text-xs text-gray-400 mt-1">Different body types recorded</p>
          </div>
        </div>

        {/* ── Body Type Charts ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-4">Body Type Distribution</h3>
            {bodyTypeStats.length > 0 ? (
              <Doughnut data={bodyTypeChartData} />
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No measurement data yet</p>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-4">Body Type Breakdown</h3>
            {bodyTypeStats.length > 0 ? (
              <div className="flex flex-col gap-3">
                {bodyTypeStats.map((b) => (
                  <div key={b.body_type} className="flex items-center gap-3">
                    <span className="capitalize text-sm font-medium text-gray-700 w-36 flex items-center gap-1">
                      <span>{bodyTypeEmoji[b.body_type] || ""}</span>
                      {b.body_type}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${(b.count / totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right font-medium">
                      {b.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No measurement data yet</p>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MEASUREMENTS DATA TABLE
        ══════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* Table header with search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-800">User Measurements</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {measurements.length} record{measurements.length !== 1 ? "s" : ""} total
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by email or body type…"
                value={measSearch}
                onChange={e => setMeasSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Height</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Bust</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Waist</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Hips</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Body Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMeasurements.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">
                      {measurements.length === 0
                        ? "No measurements submitted yet."
                        : `No results for "${measSearch}"`}
                    </td>
                  </tr>
                )}
                {filteredMeasurements.map((m) => (
                  <tr key={m.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-medium max-w-[180px] truncate">
                      {m.email}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.height} cm</td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.weight} kg</td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.bust} cm</td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.waist} cm</td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.hips} cm</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize">
                        {bodyTypeEmoji[m.body_type] || ""} {m.body_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {m.updated_at ? new Date(m.updated_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {filteredMeasurements.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {filteredMeasurements.length} of {measurements.length} records
              </p>
              <button
                onClick={handleExportCSV}
                className="text-xs text-purple-700 font-medium hover:underline flex items-center gap-1"
              >
                ⬇ Download CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-purple-700 mt-1">{value}</p>
    </div>
  );
}