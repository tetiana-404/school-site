import React from "react";
import './Home.css';
import NewsCarousel from "./NewsCarousel";
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

  return (
    <div>
      {/* START Section About*/}
      <section id="about" className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h6 className="text-warning text-uppercase mb-3">
                <i className="icofont-plus me-2"></i> Наша школа
              </h6>
              <h2 className="mb-4 fw-bold">Відкриваємо двері до успішного майбутнього</h2>
              <p className="mb-3 text-secondary">
                Мета діяльності гімназії – створення сприятливих умов для максимального розкриття учнем власної індивідуальності, закладених природою здібностей,
                нахилів та талантів, здобуття цілісної системи знань і уявлень про світ, формування національної свідомості, виявлення й підтримки найбільш
                обдарованих дітей для подальшого здобуття освіти у вищих навчальних закладах і творчої праці в різних сферах наукової та практичної діяльності.
              </p>
              <p className="mb-4 fw-semibold">

                Ми створюємо освітнє середовище, у якому кожна дитина розвиває свої здібності, навчається критично мислити та відкривати нові горизонти.
              </p>
              <div className="d-flex align-items-center">
                <a href="#more" className="btn btn-warning me-3 px-4">Детальніше</a>
                <a href="#contacts" className="text-warning text-decoration-none">
                  <i className="icofont-caret-right me-1"></i>Контакти
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative rounded overflow-hidden shadow">
                <img src="/img/12.jpg" alt="Про нас" className="img-fluid w-100" />

              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END Section About*/}

      {/* START Section Services*/}
      <section id="services" className="py-5 bg-light">
        <div className="container">


          <div className="row g-4">
            {/* Перевага 2 */}
            <div className="col-12">
              <div className="justify-content-center mb-5 w-100">
                <div className="section-title text-center">
                  <h6 className="text-success mb-2">Думай ширше</h6>
                  <h2 className=" fw-bold mb-3">Чому обирають нашу школу</h2>
                  <p className="text-muted">
                    Ми створюємо середовище, у якому кожна дитина може розкритись, отримати якісні знання, підтримку вчителів та можливість проявити себе у навчанні, творчості й позашкільному житті.
                  </p>
                </div>
              </div>
            </div></div></div>
        <div className="container">


          <div className="row g-4">
            {/* Перевага 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service-item shadow bg-white rounded p-4 text-center h-100">
                <div className="icon-holder mb-3">
                  <div className="service-item-icon-bg">
                    <i className="fas fa-person-chalkboard"></i>

                  </div>
                </div>
                <div className="service-item-text-holder">
                  <h5 className="fw-bold mb-2">Кваліфіковані вчителі</h5>
                  <p className="text-muted mb-3">
                    Наші педагоги — це не просто викладачі, а наставники, які надихають, підтримують і допомагають кожному учню досягати успіху.
                  </p>
                  <a href="#" className="btn btn-outline-warning btn-sm">ДЕТАЛЬНІШЕ</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service-item shadow bg-white rounded p-4 text-center h-100">
                <div className="icon-holder mb-3">
                  <div className="service-item-icon-bg">
                    <i className="fas fa-book"></i>

                  </div>
                </div>
                <div className="service-item-text-holder">
                  <h5 className="fw-bold mb-2">Поглиблене вивчення предметів</h5>
                  <p className="text-muted mb-3">
                    Програма школи включає підвищений рівень підготовки з математики,
                    що сприяє розвитку логічного мислення, фінансової грамотності та ІТ-компетентностей.
                  </p>
                  <a href="#" className="btn btn-outline-warning btn-sm">ДЕТАЛЬНІШЕ</a>
                </div>
              </div>
            </div>



            {/* Перевага 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service-item shadow bg-white rounded p-4 text-center h-100">
                <div className="icon-holder mb-3">
                  <div className="service-item-icon-bg">
                    <i className="fas fa-desktop"></i>

                  </div>
                </div>
                <div className="service-item-text-holder">
                  <h5 className="fw-bold mb-2">Сучасне технічне оснащення</h5>
                  <p className="text-muted mb-3">
                    20 мультимедійних класів, забезпечених інтерактивними дошками та комп’ютерами, що дозволяє зробити навчання більш наочним, динамічним і ефективним.
                  </p>
                  <a href="#" className="btn btn-outline-warning btn-sm">ДЕТАЛЬНІШЕ</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* END Section Services*/}

      {/* START Section Counter*/}
      <section
        id="counter"
        className="counter-padding overlay text-white py-5  section-back-image"
      >
        <div className="auto-container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-8 col-12 mx-lg-auto mx-md-auto mx-0">
              <div className="counter-info mb-4 w-100">
                <div className="counter-icon">
                  <i className="fas fa-history fa-2x"></i>
                </div>
                <div className="counter-des">
                  <h2>
                    <span>Ми ростемо разом,  </span>
                    <br /> день за днем, крок за кроком!
                  </h2>
                  <p>Наші досягнення за 2023 - 2024 навчальний рік</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5 wow fadeInUp">
            <div className="col-lg-8 col-md-8 col-12 mx-lg-auto mx-md-auto mx-0 text-lg-left text-md-left">
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
                  <div className="single-counter-item">
                    <h4 className="fw-bold display-6">2</h4>
                    <p className="mb-0 text-uppercase">місце у рейтингу<br /> шкіл Львова</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
                  <div className="single-counter-item">
                    <h4 className="fw-bold display-6">7 </h4>
                    <p className="mb-0 text-uppercase">місце у рейтингу <br /> шкіл України</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
                  <div className="single-counter-item">
                    <h4 className="fw-bold display-6">12</h4>
                    <p className="mb-0 text-uppercase">золотих <br />  медалей</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-0 mb-md-0 mb-sm-4 mb-4">
                  <div className="single-counter-item">
                    <h4 className="fw-bold display-6">2</h4>
                    <p className="mb-0 text-uppercase">срібні <br />  медалі</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      {/* END Section Counter*/}

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
                            className="img-fluid mb-3"
                            src={member.img}
                            alt={member.name}
                            style={{ width: '100%', borderRadius: '10px' }}
                          />
                          <div className="single-team-member-content">
                            <ul className="single-team-member-social list-inline mb-2">
                              <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faFacebook} /></a></li>
                              <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faBlogger} /></a></li>
                              <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faPinterest} /></a></li>
                              <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faYoutube} /></a></li>
                            </ul>
                            <div className="single-team-member-text">
                              <h4>{member.name}</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{member.position}</p>
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
    </div>
  );
};

export default Home;
