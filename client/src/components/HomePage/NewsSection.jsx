import React from 'react';
import NewsCarousel from '../NewsCarousel'; 

const NewsSection = () => {
  return (
    <section id="blog" className="section-padding bg-gray">
      <div className="auto-container">
        <div className="row">
          <div className="col-lg-7 col-md-7 col-12 mx-auto text-center">
            <div className="section-title">
              <h6 className="theme-color">Ми хочемо поділитись з вами...</h6>
              <h2>Останні новини</h2>
              <p>
                Слідкуйте за найважливішими подіями шкільного життя! Тут ви знайдете інформацію про досягнення учнів, участь у конкурсах,
                оновлення програм навчання та цікаві заходи, які відбуваються у нашій гімназії.
              </p>
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
  );
};

export default NewsSection;
