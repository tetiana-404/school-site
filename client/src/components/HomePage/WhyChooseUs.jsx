import React from 'react';

const advantages = [
  {
    icon: 'fas fa-person-chalkboard',
    title: 'Кваліфіковані вчителі',
    text: 'Наші педагоги — це не просто викладачі, а наставники, які надихають, підтримують і допомагають кожному учню досягати успіху.',
  },
  {
    icon: 'fas fa-book',
    title: 'Поглиблене вивчення предметів',
    text: 'Програма школи включає підвищений рівень підготовки з математики, що сприяє розвитку логічного мислення, фінансової грамотності та ІТ-компетентностей.',
  },
  {
    icon: 'fas fa-desktop',
    title: 'Сучасне технічне оснащення',
    text: '20 мультимедійних класів, забезпечених інтерактивними дошками та комп’ютерами, що дозволяє зробити навчання більш наочним, динамічним і ефективним.',
  },
];

const WhyChooseUs = () => {
  return (
    <section id="services" className="py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          <div className="col-12">
            <div className="justify-content-center mb-5 w-100">
              <div className="section-title text-center">
                <h6 className="text-success mb-2">Думай ширше</h6>
                <h2 className="fw-bold mb-3">Чому обирають нашу школу</h2>
                <p className="text-muted">
                  Ми створюємо середовище, у якому кожна дитина може розкритись, отримати якісні знання,
                  підтримку вчителів та можливість проявити себе у навчанні, творчості й позашкільному житті.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {advantages.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="single-service-item shadow bg-white rounded p-4 text-center h-100">
                <div className="icon-holder mb-3">
                  <div className="service-item-icon-bg">
                    <i className={item.icon}></i>
                  </div>
                </div>
                <div className="service-item-text-holder">
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted mb-3">{item.text}</p>
                  <a href="#" className="btn btn-outline-warning btn-sm">
                    ДЕТАЛЬНІШЕ
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
