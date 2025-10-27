import React, { useState, useEffect } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState({
    address: "м.Львів, вул.Любінська, 93А",
    email: "yevshan79@gmail.com",
    phone: "+38(032)262-20-36",
  });

  const [state, handleSubmit] = useForm("mpwlvlwr");
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone_number: "",
    Subject: "",
    Message: "",
  });


  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`);
        const data = await res.json();
        setData(prev => ({
          address: data.address || prev.address,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          form: data.form || prev.form
        }));

      } catch (error) {
        console.error("Failed to fetch contact:", error);
      }
    };

    fetchContact();
  }, []);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // handleChange для форми
  const handleFormChange = (e) => {
      setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveData = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setEditMode(false);
    } catch (err) {
      console.error("Помилка при збереженні:", err);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
    const response = await fetch("https://formspree.io/f/mpwlvlwr", {
      method: "POST",
      body: formDataToSend, 
      headers: {
        Accept: "application/json", 
      },
    });

    if (response.ok) {
      toast.success("✅ Повідомлення надіслано!");
      //alert("✅ Повідомлення надіслано!");
      setFormData({
        Name: "",
        Email: "",
        Phone_number: "",
        Subject: "",
        Message: "",
      });
    } else {
      alert("❌ Помилка при надсиланні");
    }
  } catch (err) {
    console.error("Formspree error:", err);
  }
};


  return (
    <section id="contact" className="section-padding">
      <div className="auto-container">
        <div className="row">
          {/* Ліва частина */}
          <div className="col-lg-5 col-md-5 col-12 mb-lg-0 mb-md-0 mb-5 position-relative">
            <div className="address-box-wrap bg-gray shadow-sm p-lg-5 p-md-3 p-3">

              {user?.role === "admin" && (
                <div className="position-absolute top-0 end-0 me-4 mt-3">
                  {!editMode && (
                    <>
                      <button className="btn btn-outline-secondary" onClick={() => setEditMode(true)}>
                        ✏️
                      </button>
                    </>
                  )}
                </div>
              )}
              <div className="address-box-sin mb-4">
                <div className="address-box-icon">

                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="address-box-des">
                  <h4>Адреса</h4>
                  {editMode ? (
                    <input
                      type="text"
                      name="address"
                      value={data.address}
                      onChange={handleDataChange}
                      className="form-control"
                    />
                  ) : (
                    <p>{data.address}</p>
                  )}
                </div>
              </div>
              <div className="address-box-sin mb-4">
                <div className="address-box-icon">

                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="address-box-des">
                  <h4>Email</h4>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleDataChange}
                      className="form-control"
                    />
                  ) : (
                    <p>{data.email}</p>
                  )}
                </div>
              </div>
              <div className="address-box-sin mb-4">
                <div className="address-box-icon">

                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="address-box-des">
                  <h4>Телефон</h4>
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={data.phone}
                      onChange={handleDataChange}
                      className="form-control"
                    />
                  ) : (
                    <p>{data.phone}</p>
                  )}
                </div>
              </div>
              {editMode && (
                <>
                  <button
                    className="btn btn-outline-success btn-lg w-50"
                    onClick={handleSaveData}
                  >
                    💾 Зберегти
                  </button>

                  <button className="btn btn-outline-warning btn-lg w-50 mw-3" onClick={() => setEditMode(false)}>❌ Скасувати</button>

                </>
              )}
            </div>
          </div>

          {/* Права частина */}
          <div className="col-lg-7 col-md-7 col-12 pl-lg-5 pl-md-3 pl-0">
            <div className="contact-heading mb-5">
              <h2>Приєднуйтесь до нас</h2>
            </div>
            <div className="contact-form-wrap">

              <form id="main-form" className="contact-form form"
                onSubmit={handleSubmitForm}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-icon"><i className="icofont-user"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        placeholder="Ім'я"
                        required=""
                        onChange={handleFormChange}
                        value={formData.Name} />
                      <label className="name">Ім'я*</label>
                      <ValidationError prefix="Name" field="Name" errors={state.errors} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-icon"><i className="icofont-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="Email"
                        placeholder="example@xyz.com"
                        required=""
                        onChange={handleFormChange}
                        value={formData.Email} />
                      <label className="email" htmlFor="Email">Email*</label>
                      <ValidationError
                        prefix="Email"
                        field="Email"
                        errors={state.errors}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-icon"><i className="icofont-ui-dial-phone"></i></span>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone_number"
                        name="Phone_number"
                        placeholder="xxx-xxx-xxxx"
                        required=""
                        value={formData.Phone_number}
                        onChange={handleFormChange}></input>
                      <label className="number">Контактний номер*</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-icon"><i className="icofont-at"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="Subject"
                        placeholder="Тема"
                        required=""
                        value={formData.Subject}
                        onChange={handleFormChange}></input>
                      <label className="subject">Тема*</label>
                    </div>
                  </div>
                </div>
                <div className="form-group form-message">
                  <textarea
                    className="form-control"
                    id="message"
                    rows="6"
                    name="Message"
                    placeholder="Повідомлення"
                    value={formData.Message}
                    onChange={handleFormChange}></textarea>

                </div>
                <div className="text-center wow fadeInUp" style={{ visibility: "visible", animationName: "fadeInUp" }}>
                  <div className="actions">
                    <button type="submit"
                      className="btn btn-outline-success btn-lg w-50"
                      disabled={state.submitting}>
                      НАДІСЛАТИ
                    </button>
                    <img alt="" src="assets/img/ajax-loader.gif" id="loader" style={{ display: "none", alt: "loading", width: "16px", height: "16px" }} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
      </div>
<div className="row mt-5">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2574.2075568483856!2d23.972468362130574!3d49.81976407135968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473ae771e4d90b33%3A0x75cfa84a200a7726!2z0LLRg9C70LjRhtGPINCb0Y7QsdGW0L3RgdGM0LrQsCwgOTPQkCwg0JvRjNCy0ZbQsiwg0JvRjNCy0ZbQstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA3OTAwMA!5e0!3m2!1suk!2sua!4v1755876958681!5m2!1suk!2sua" width="100%" height="450" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </section>
  );
};



export default ContactPage;
