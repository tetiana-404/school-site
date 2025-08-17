import React, { useEffect, useState } from 'react';
import "../../Styles/global.css";
import TeamSection from "../../HomePage/TeamSection";
import RichTextEditor from "../../RichTextEditor";

const AboutPage = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const [editCounters, setEditCounters] = useState(false);

  const [teamContent, setTeamContent] = useState('');
  const [counters, setCounters] = useState([]);
  const [info, setInfo] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    schedule: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = [
        ['/contact', setInfo],
        ['/api/home_about_page', (data) => setTeamContent(data.content)],
        ['/api/home_counter', setCounters],
      ];

      for (const [endpoint, setter] of endpoints) {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`);
          const data = await res.json();
          setter(data);
        } catch (err) {
          console.error(`Failed to fetch ${endpoint}`, err);
        }
      }
    };

    fetchData();
  }, []);

  const handleSave = async (endpoint, method, body, callback) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      callback();
    } catch (err) {
      console.error(`Помилка при збереженні: ${endpoint}`, err);
    }
  };

  const handleInputChange = (field) => (e) =>
    setInfo((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      <section id="pabout" className="section-padding bg-light">
        <div className="auto-container">
          <div className="row">
            <div className='col-lg-12'>
              <div className="welcome-section-title">
                <h6 className="theme-color">Загальна інформація</h6>
                <h2>Про гімназію</h2>
              </div>
            </div>
          </div>

          <div className='row mt-5'>
            <div className='col-lg-4 col-md-6 col-sm-12 position-relative'>
              {user?.role === 'admin' && !editMode && (
                <button
                  className="btn btn-outline-dark position-absolute top-0 m-0 w-auto"
                  style={{ right: 20 }}
                  onClick={() => setEditMode(true)}
                >
                  ✏️
                </button>
              )}

              {[
                ['Повна назва установи', 'fullName'],
                ['Юридична адреса', 'address'],
              ].map(([label, field]) => (
                <div key={field} className="mb-4">
                  <h4>{label}</h4>
                  {editMode ? (
                    <input
                      type="text"
                      value={info[field]}
                      onChange={handleInputChange(field)}
                      className="form-control"
                    />
                  ) : (
                    <p>{info[field]}</p>
                  )}
                </div>
              ))}

              <div className="mb-4">
                <h4>Контакти</h4>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      placeholder="Телефон"
                      value={info.phone}
                      onChange={handleInputChange('phone')}
                      className="form-control mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Email"
                      value={info.email}
                      onChange={handleInputChange('email')}
                      className="form-control"
                    />
                  </>
                ) : (
                  <>
                    <p>Телефон: {info.phone}</p>
                    <p>Email: {info.email}</p>
                  </>
                )}
              </div>

              <div className="mb-4">
                <h4>Графік роботи школи</h4>
                {editMode ? (
                  <textarea
                    value={info.schedule}
                    onChange={handleInputChange('schedule')}
                    className="form-control"
                  />
                ) : (
                  <p style={{ whiteSpace: "pre-line" }}>{info.schedule}</p>
                )}
              </div>

              {editMode && (
                <div className="d-flex gap-2 mb-3">
                  <button className="btn btn-outline-success btn-lg w-50" onClick={() => handleSave('/contact', 'PUT', info, () => setEditMode(false))}>💾 Зберегти</button>
                  <button className="btn btn-outline-warning btn-lg w-50" onClick={() => setEditMode(false)}>❌ Скасувати</button>
                </div>
              )}
            </div>

            <div className='col-lg-8 col-md-6 col-sm-12 mb-5'>
              <img className="img-fluid about-image-hover" src={process.env.PUBLIC_URL + '/img/1.jpg'} alt="Про гімназію" />
            </div>
          </div>
        </div>
      </section>

      <section id="counter" className="counter-section counter-padding overlay section-back-image" style={{ backgroundImage: "url('/img/bg/counter-bg-2.jpg')" }}>
        {user?.role === 'admin' && !editCounters && (
          <button className="btn btn-outline-dark position-absolute top-0 m-0 w-auto" style={{ right: 20 }} onClick={() => setEditCounters(true)}>✏️</button>
        )}

        <div className="auto-container">
          <div className="row text-center">
            {counters.map((counter, index) => (
              <div key={index} className="col-lg-3 col-md-3 col-12 mb-4">
                <div className="single-counter-item single-counter-item-s-2">
                  {user?.role === 'admin' && editCounters ? (
                    <>
                      <input
                        type="number"
                        value={counter.value}
                        onChange={(e) => {
                          const newCounters = [...counters];
                          newCounters[index].value = +e.target.value;
                          setCounters(newCounters);
                        }}
                        className="form-control text-center mb-2"
                      />
                      <input
                        type="text"
                        value={counter.text}
                        onChange={(e) => {
                          const newCounters = [...counters];
                          newCounters[index].text = e.target.value;
                          setCounters(newCounters);
                        }}
                        className="form-control text-center"
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="timer">{counter.value}</h4>
                      <p>{counter.text}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {user?.role === 'admin' && editCounters && (
            <div className='row text-center'>
              <div className='col-12 mb-4'>
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button className="btn btn-outline-success btn-lg z-3" onClick={() => handleSave('/api/home_counter', 'PUT', counters, () => setEditCounters(false))}>💾 Зберегти</button>
                  <button className="btn btn-outline-warning btn-lg z-3" onClick={() => setEditCounters(false)}>❌ Скасувати</button>
                </div>
              </div>
            </div>
          )}
          <div className="welcome-section-title">
            <h6 className="text-white z-3">станом на 2025 рік</h6>
          </div>
        </div>
      </section>

      <TeamSection />

      <section id="teamInfo" className="section-padding py-5">
        <div className="auto-container">
          <div className='row'>
            <div className="col-lg-8 mx-auto col-md-12">
              {editTeam ? (
                <>
                  <RichTextEditor
                    content={teamContent}
                    setContent={setTeamContent}
                    placeholder="Введіть інформацію про команду"
                  />
                  <div className="text-center mt-3">
                    <button className="btn btn-outline-success btn-lg w-50" onClick={() => handleSave('/api/home_about_page', 'PUT', { content: teamContent }, () => setEditTeam(false))}>💾 Зберегти</button>
                    <button className="btn btn-outline-warning btn-lg w-50" onClick={() => setEditTeam(false)}>❌ Скасувати</button>
                  </div>
                </>
              ) : (
                <div className='position-relative'>
                  {user?.role === 'admin' && (
                    <button className="btn btn-outline-dark position-absolute top-0 m-3 w-auto" style={{ right: 20 }} onClick={() => setEditTeam(true)}>✏️</button>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: teamContent }} />
                </div>
              )}
            </div></div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
