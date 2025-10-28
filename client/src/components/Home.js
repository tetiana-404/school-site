import React from "react";
import './Home.css';
import HomeImgSlider from "./HomePage/HomeImgSlider";
import HomeAboutSection from "./HomePage/HomeAboutSection";
import WhyChooseUs from "./HomePage/WhyChooseUs"
import CounterSection from "./HomePage/CounterSection";
import TeamSection from "./HomePage/TeamSection";
import NewsSection from "./HomePage/NewsSection";

const Home = () => {

  const user = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <div>
      <HomeImgSlider user={user} /> 
      <HomeAboutSection user={user} />
      <WhyChooseUs />
      <CounterSection user={user} />
      <TeamSection user={user} />
      <NewsSection />
    </div>
  );
};

export default Home;
