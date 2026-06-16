import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AccessoriesSectionHome from "../components/AccessoriesSectionHome";
import FeaturedClothes from "../components/FeaturedClothes";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <AccessoriesSectionHome />
      <FeaturedClothes />
      <Footer />
    </div>
  );
}
