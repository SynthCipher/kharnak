import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection.jsx";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox.jsx";
import Footer from "../components/Footer.jsx";
const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
    <NewsletterBox/>
    </div>
  );
};

export default Home;
