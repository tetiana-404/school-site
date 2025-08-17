import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeImgSlider.css';

const HomeImgSlider = ({ user }) => {
  const initialSlides = [
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

  const [slides, setSlides] = useState(initialSlides);
  const [editMode, setEditMode] = useState(false);
  const [editedSlides, setEditedSlides] = useState(initialSlides);

  const handleChange = (index, field, value) => {
    const updated = [...editedSlides];
    updated[index][field] = value;
    setEditedSlides(updated);
  };

  const saveChanges = async () => {
    try {
      for (let slide of editedSlides) {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home_sliders/${slide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slide),
        });

        if (!res.ok) {
          throw new Error(`Failed to update slide with id ${slide.id}`);
        }
      }
      setSlides(editedSlides);
      setEditMode(false);
    } catch (err) {
      console.error('❌ Saving slides failed:', err);
    }
  };

  const cancelChanges = () => {
    setEditedSlides(slides);
    setEditMode(false);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const newUrl = data.url;

      const updated = [...editedSlides];
      updated[index].image = newUrl;
      setEditedSlides(updated);
    } catch (err) {
      console.error('❌ Upload image failed:', err);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    responsive: [
      { breakpoint: 992, settings: { fade: false } },
      { breakpoint: 768, settings: { fade: false, slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home_sliders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setSlides(initialSlides);
          setEditedSlides(initialSlides);
        } else {
          setSlides(data);
          setEditedSlides(data);
        }
      })
      .catch((err) => console.error('❌ Fetching slides failed:', err));
  }, []);

  return (
    <section className="slider-section position-relative">
      {user?.role === 'admin' && !editMode && (
        <div className="position-absolute top-0 end-0 p-3 z-3">
          <button className="btn btn-outline-light btn-md" onClick={() => setEditMode(true)}>
            ✏️
          </button>
        </div>
      )}

      <Slider {...settings}>
        {(editMode ? editedSlides : slides).map((slide, index) => (
          <div key={index}>
            <div
              className="home-single-slide d-flex align-items-center"
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL/slide.image})`,
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
                      {editMode ? (
                        <>
                          {['title', 'subtitle', 'text'].map((field, i) => (
                            <div className="mb-2 mb-sm-3" key={i}>
                              {field !== 'text' ? (
                                <input
                                  type="text"
                                  value={slide[field]}
                                  onChange={(e) => handleChange(index, field, e.target.value)}
                                  className="form-control"
                                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                />
                              ) : (
                                <textarea
                                  rows="3"
                                  value={slide[field]}
                                  onChange={(e) => handleChange(index, field, e.target.value)}
                                  className="form-control"
                                  placeholder="Текст"
                                />
                              )}
                            </div>
                          ))}
                          <div className="mb-2 mb-sm-3">
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </div>
                          <div className="d-flex flex-sm-row gap-3 text-center mt-2 mt-sm-3">
                            <button className="btn btn-outline-success w-50" onClick={saveChanges}>
                              💾 Зберегти
                            </button>
                            <button className="btn btn-outline-light w-50" onClick={cancelChanges}>
                              ❌ Скасувати
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="fw-light mb-3">{slide.title}</h4>
                          <h2 className="fw-bold mb-4">{slide.subtitle}</h2>
                          <p className="lead mb-4">{slide.text}</p>
                          <div>
                            <a href="#" className="btn btn-warning me-3 mb-2" style={{ minWidth: 130 }}>
                              Детальніше
                            </a>
                            <a href="#" className="btn btn-outline-light mb-2" style={{ minWidth: 130 }}>
                              Контакти
                            </a>
                          </div>
                        </>
                      )}
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

export default HomeImgSlider;
