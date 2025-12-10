import React, { useEffect, useState } from 'react';
import "../../Styles/global.css";
import TeamSection from "../../HomePage/TeamSection";
import RichTextEditor from "../../RichTextEditor";
import { Container, Box, Grid, Card, CardContent, Button, Typography } from "@mui/material";

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
        ['home_about_page', (data) => setTeamContent(data.content)],
        ['home_counter', setCounters],
      ];

      for (const [endpoint, setter] of endpoints) {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`);
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
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      callback();
    } catch (err) {
      console.error(`Помилка при збереженні: ${endpoint}`, err);
    }
  };

  const handleSaveAbout = async () => {
    const body = {
      fullName: info.fullName,
      address: info.address,
      phone: info.phone,
      email: info.email,
      schedule: info.schedule,
      image: info.image || null,
    };

    handleSave("/contact", "PUT", body, () => setEditMode(false));
  };

  const handleInputChange = (field) => (e) =>
    setInfo((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      <div
        className="section-padding section-back-image-2 overlay"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/1.jpg'})` }}
      >
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-12 my-auto">
              <div className="text-center">
                <h2
                  className="page-banner-title display-1 display-md-3 display-sm-5"
                  style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                  Про гімназію</h2>
                <div
                  className="page-banner-breadcrumb"
                  style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                  <p>Загальна інформація</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <section id="pabout" className="section-padding bg-light pt-lg-5 pb-lg-5 pt-md-4 pb-md-4 pt-sm-3 pb-sm-3">
        <div className="auto-container">
          <div className='row position-relative justify-content-center'>
            {user?.role === "admin" && !editMode && (
              <button
                className="btn btn-outline-dark position-absolute top-0 m-0 w-auto"
                style={{ right: 20 }}
                onClick={() => setEditMode(true)}
              >
                ✏️
              </button>
            )}
            <div className="col-lg-1"></div>
            {/* Повна назва установи */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4">
              <h4>Повна назва установи</h4>
              {editMode ? (
                <input
                  type="text"
                  value={info.fullName}
                  onChange={handleInputChange("fullName")}
                  className="form-control"
                />
              ) : (
                <p>{info.fullName}</p>
              )}
            </div>

            {/* Юридична адреса */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4">
              <h4>Юридична адреса</h4>
              {editMode ? (
                <input
                  type="text"
                  value={info.address}
                  onChange={handleInputChange("address")}
                  className="form-control"
                />
              ) : (
                <p>{info.address}</p>
              )}
            </div>
            <div className="col-lg-1"></div>

            <div className="col-lg-1"></div>
            {/* Контакти */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4">
              <h4>Контакти</h4>
              {editMode ? (
                <>
                  <input
                    type="text"
                    placeholder="Телефон"
                    value={info.phone}
                    onChange={handleInputChange("phone")}
                    className="form-control mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={info.email}
                    onChange={handleInputChange("email")}
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

            {/* Графік роботи */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-4">
              <h4>Графік роботи школи</h4>
              {editMode ? (
                <textarea
                  value={info.schedule}
                  onChange={handleInputChange("schedule")}
                  className="form-control"
                />
              ) : (
                <p style={{ whiteSpace: "pre-line" }}>{info.schedule}</p>
              )}
            </div>
            <div className="col-lg-1"></div>

            {editMode && (
              <div className="col-12 d-flex gap-2 mb-3">
                <button
                  className="btn btn-outline-success btn-lg w-50"
                  onClick={handleSaveAbout}
                >
                  💾 Зберегти
                </button>
                <button
                  className="btn btn-outline-warning btn-lg w-50"
                  onClick={() => setEditMode(false)}
                >
                  ❌ Скасувати
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="counter" className="counter-section counter-padding overlay section-back-image" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/bg/counter-bg-2.jpg)` }}>
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
                  <button className="btn btn-outline-success btn-lg z-3" onClick={() => handleSave('home_counter', 'PUT', counters, () => setEditCounters(false))}>💾 Зберегти</button>
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


      <section id="teamInfo" className="welcome-section-padding bg-gray">
        <div className="auto-container">
          <div className="row">
            <div className='col-lg-8 col-md-6'>
              {editTeam ? (
                <>
                  <RichTextEditor
                    content={teamContent}
                    setContent={setTeamContent}
                    placeholder="Введіть інформацію про команду"
                  />
                  <Box display="flex" gap={2} mt={3} justifyContent="center" flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() =>
                        handleSave(
                          "home_about_page",
                          "PUT",
                          { content: teamContent },
                          () => setEditTeam(false)
                        )
                      }
                    >
                      💾 Зберегти
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => setEditTeam(false)}
                    >
                      ❌ Скасувати
                    </Button>
                  </Box>
                </>
              ) : (
                <Box position="relative">
                  {user?.role === "admin" && (
                    <Button
                      variant="outlined"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => setEditTeam(true)}
                    >
                      ✏️
                    </Button>

                  )}
                  <Box dangerouslySetInnerHTML={{ __html: teamContent }} />
                </Box>
              )}
            </div>
            <div className='col-lg-4 col-md-6 col-sm-12 mb-5'>
              <img className="img-fluid about-image-hover" src={process.env.PUBLIC_URL + '/img/bell.jpg'} alt="Про гімназію" />
            </div>
          </div>
        </div>


      </section>


    </>
  );
};

export default AboutPage;
