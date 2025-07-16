import React from "react";
import './Home.css';
import NewsCarousel from "./NewsCarousel";
import HomeImgSlider from "./HomePage/HomeImgSlider";
import HomeAboutSection from "./HomePage/HomeAboutSection";
import WhyChooseUs from "./HomePage/WhyChooseUs"
import CounterSection from "./HomePage/CounterSection";
import TeamSection from "./HomePage/TeamSection";
import NewsSection from "./HomePage/NewsSection";
import NewsletterSection from "./HomePage/NewsletterSection";
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faPinterest, faYoutube, faBlogger } from '@fortawesome/free-brands-svg-icons';


const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const teamMembers = [
    {
      name: 'Назар Божена Володимирівна',
      position: 'Директор \nгімназії',
      img: '/img/team/Назар Б.В.2.jpg',
    },
    {
      name: 'Дячишин Ірина Миронівна',
      position: 'Заступник директора з навчально-методичної роботи',
      img: '/img/team/Дячишин І.М..jpg',
    },
    {
      name: 'Мадай Лідія Орестівна',
      position: 'Заступник директора з навчальної роботи',
      img: '/img/team/Мадай Л.О.2.jpg',
    },
    {
      name: 'Козак Мирослава Миронівна',
      position: 'Заступник директора з виховної роботи',
      img: '/img/team/Козак М.М.2.jpg',
    },

    {
      name: 'Jony Smith',
      position: 'Drawing Teacher',
      img: 'assets/img/team/2.jpg',
    },
    {
      name: 'Jone Doe',
      position: 'Swimming Teacher',
      img: 'assets/img/team/1.jpg',
    },
  ];

  const user = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <div>
      <HomeImgSlider user={user} /> 
      <HomeAboutSection user={user} />
      <WhyChooseUs />
      <CounterSection user={user} />
      <TeamSection user={user} />
      <NewsSection />
      <NewsletterSection />
      
    </div>
  );
};

export default Home;
