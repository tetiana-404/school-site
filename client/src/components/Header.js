import React, { useState, useEffect, useRef } from 'react';
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Header.css"



const Header = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const menuRef = useRef(null);
  const [stickyOffset, setStickyOffset] = useState(0);

  useEffect(() => {
    const menu = menuRef.current;
    if (menu) {
      setStickyOffset(menu.offsetTop); // Отримаємо координату тільки після монтування
    }
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const handleScroll = () => {
      if (window.pageYOffset >= stickyOffset) {
        menu.classList.add('sticky-fixed');
      } else {
        menu.classList.remove('sticky-fixed');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyOffset]);


  return (
    <header className="header">
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100">
          <div className="mb-3 mb-md-0">
            <img
              src="/img/logo.png"
              alt="Євшан"
              className="img-fluid"
              style={{ maxWidth: "250px" }}
            />
          </div>

          <div className="contact-info d-flex flex-wrap justify-content-center justify-content-md-end align-items-center text-center text-md-end gap-3">
            <div>
              <i className="fas fa-envelope me-2 text-success"></i>
              <a href="mailto:yevshan79@gmail.com" className="text-decoration-none text-dark">yevshan79@gmail.com</a>
            </div>
            <div>
              <i className="fas fa-phone me-2 text-success"></i>
              <a href="tel:+38032262-20-36" className="text-decoration-none text-dark">+38 (032) 262 20 36</a>
            </div>
          </div>
        </div>
      </div>

      <div className='mainmenu-area' ref={menuRef}>
        <div className='auto-container'>
            <nav className="navbar navbar-expand-lg navbar-gradient">
              <div className="container-fluid">
                <button className="navbar-toggler" style={{margin:"10px 0"}} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Перемикач навігації">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav w-100 d-flex justify-content-between">
                    <li className="nav-item">
                      <a className="nav-link" href="#">Новини</a>
                    </li>


                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" id="dropdownStudents" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Для учнів
                        <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 4 6 8 10 4" />
                        </svg>
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="dropdownStudents">
                        <li><a className="dropdown-item" href="#">Ресурси для учнів</a></li>
                        <li><a className="dropdown-item" href="#">Розклад</a></li>
                        <li><a className="dropdown-item" href="#">Календар подій</a></li>
                      </ul>
                    </li>


                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" id="dropdownParents" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Для батьків
                        <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 4 6 8 10 4" />
                        </svg>
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="dropdownParents">
                        <li><a className="dropdown-item" href="#">Інформація для батьків</a></li>
                        <li><a className="dropdown-item" href="#">Контакти вчителів</a></li>
                        <li><a className="dropdown-item" href="#">Рекомендації</a></li>
                      </ul>
                    </li>


                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" id="dropdownTeachers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Для вчителів
                        <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 4 6 8 10 4" />
                        </svg>
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="dropdownTeachers">
                        <li><a className="dropdown-item" href="#">Інформація для батьків</a></li>
                        <li><a className="dropdown-item" href="#">Контакти вчителів</a></li>
                        <li><a className="dropdown-item" href="#">Рекомендації</a></li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <a className="nav-link" href="#">Наші досягнення</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Публічна інформація</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Фінансова прозорість</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Контакти</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
