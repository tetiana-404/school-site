import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImgSlider.css';

const ImgSlider = () => {
  const slides = [
    {
      image: '/img/1.jpg',
      title: 'Нові горизонти знань',
      subtitle: 'Якісне навчання',
      text: 'Ми створюємо освітнє середовище, де знання стають основою впевненого майбутнього.',
    },
    {
      image: '/img/11.png',
      title: 'Простір для зростання',
      subtitle: 'Комфортне навчальне середовище',
      text: 'Ми дбаємо про затишок і безпеку, щоб кожна дитина навчалася з радістю та натхненням.',
    },
    {
      image: '/img/6.jpg',
      title: 'Відкритий світ можливостей',
      subtitle: 'Участь у конкурсах і проєктах',
      text: 'Наші учні реалізовують свій потенціал у творчих проєктах, олімпіадах і змаганнях — впевнено крокуючи до успіху.',
    },
    {
      image: '/img/7.jpeg',
      title: 'Навчання з натхненням',
      subtitle: 'Яскраве шкільне життя',
      text: 'Ми поєднуємо навчання з активним і пізнавальним дозвіллям, щоб кожен день у школі був захопливим та пам’ятним.',
    },
    {
      image: '/img/teachers.jpg',
      title: 'Професіоналізм і турбота',
      subtitle: 'Вчителі, які надихають',
      text: 'Наші педагоги — це досвідчені й віддані своїй справі наставники, які допомагають дітям розкривати свій потенціал та впевнено крокувати до успіху',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    responsive: [
      {
        breakpoint: 992, 
        settings: {
          fade: false,   
                },
      },
      {
        breakpoint: 768, 
        settings: {
          dots: true,
          arrows: false,
          fade: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="slider-section">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="home-single-slide d-flex align-items-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                color: 'white',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  zIndex: 1,
                }}
              />
              <div className="container" style={{ zIndex: 2 }}>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="text-white">
                      <h4 className="fw-light mb-3">
                        {slide.title}
                      </h4>
                      <h2 className="fw-bold mb-4">
                        {slide.subtitle}
                      </h2>
                      <p className="lead mb-4" >
                        {slide.text}
                      </p>
                      <div>
                        <a
                          href="#"
                          className="btn btn-warning me-3 mb-2"
                          style={{ minWidth: 130 }}
                        >
                          Детальніше
                        </a>
                        <a
                          href="#"
                          className="btn btn-outline-light mb-2"
                          style={{ minWidth: 130 }}
                        >
                          Контакти
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ImgSlider;
