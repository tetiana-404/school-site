import React from "react";
import './Home.css';
import NewsCarousel from "./NewsCarousel";
import HomeImgSlider from "./HomePage/HomeImgSlider";
import HomeAboutSection from "./HomePage/HomeAboutSection";
import WhyChooseUs from "./HomePage/WhyChooseUs"
import CounterSection from "./HomePage/CounterSection";
import TeamSection from "./HomePage/TeamSection";
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
      
      {/* START Section Team*/}
      <section id="team" className="section-padding py-5 ">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-7 col-md-7 col-12 mx-auto text-center">
              <div className="section-title">
                <h6 className="text-success mb-2">Навчаємо з любов'ю</h6>
                <h2 className=" fw-bold mb-3">Наші вчителі</h2>
                <p className="py-3">Натхненні професіонали, які ведуть дітей до успіху.</p>
              </div>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col">
              <div className="team-carousel-section">
                <Slider {...settings}>
                  {teamMembers.map((member, index) => (
                    <div className="owl-item active" style={{ width: '226px', marginRight: '30px' }}>
                      <div key={index} className="single-team-wrapper p-3 text-center">
                        <div className="single-team-member">
                          <img
                            className="img-fluid"
                            src={member.img}
                            alt={member.name}
                            style={{ width: '100%' }}
                          />
                          <div className="single-team-member-content">
                            <div className="single-team-member-social list-inline mb-2">
                              <p className="list-inline-item"><a href="#">{member.position}</a></p>
                            </div>
                            <div className="single-team-member-text">
                              <h4>{member.name}</h4>
                            </div>
                          </div>
                        </div>
                      </div></div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>

      </section>
      {/* END Section Team*/}

      {/* START Section blog*/}
      <section id="blog" className="section-padding bg-gray">
        <div className="auto-container">
          <div className="row">
            <div className="col-lg-7 col-md-7 col-12 mx-auto text-center">
              <div className="section-title">
                <h6 className="theme-color">Ми хочемо поділитись з вами...</h6>
                <h2>Останні новини</h2>
                <p>Слідкуйте за найважливішими подіями шкільного життя! Тут ви знайдете інформацію про досягнення учнів, участь у конкурсах, оновлення програм навчання та цікаві заходи, які відбуваються у нашій гімназії.</p>

              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">

              <NewsCarousel />

            </div>
          </div>

        </div>
      </section>
      {/* END Section blog */}

      {/* START NEWSLETTER SECTION */}
      <section id="hnewsletter" class="hnewslettr-padding bg-theme">
         <div class="auto-container">
            <div class="row">
               <div class="col-lg-12 col-12 mb-lg-5 mb-4">
                 &nbsp;
               
               </div>
               
            </div>
         </div>
      </section>
      {/* END NEWSLETTER SECTION */}
    </div>
  );
};

export default Home;
