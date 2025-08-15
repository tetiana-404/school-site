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
            <Link to="/"> <img
              src="/img/logo.png"
              alt="Євшан"
              className="img-fluid"
              style={{ maxWidth: "250px" }}
            /></Link>
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
              <button className="navbar-toggler" style={{ margin: "10px 0" }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Перемикач навігації">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav w-100 d-flex justify-content-between">
                  <li className="nav-item">
                    <Link className="nav-link" to="/posts">Новини</Link>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="dropdownStudents"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Про <br /> гімназію
                      <svg
                        className="dropdown-arrow"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#6c757d"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2 4 6 8 10 4" />
                      </svg>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownStudents">
                      <li><Link className="dropdown-item" to="/about">Загальна інформація</Link></li>
                      <li><Link className="dropdown-item" to="/history">Історія</Link></li>
                      <li><Link className="dropdown-item" to="/anthem">Гімн гімназії</Link></li>
                      <li><Link className="dropdown-item" to="/documents">Установчі документи</Link></li>
                      <li><Link className="dropdown-item" to="/strategy">Стратегія розвитку гімназії</Link></li>
                      <li><Link className="dropdown-item" to="/work-plan">План роботи гімназії</Link></li>
                      <li><Link className="dropdown-item" to="/reports">Звіти директора</Link></li>
                      <li><Link className="dropdown-item" to="/teachers">Кадровий склад</Link></li>
                      <li><Link className="dropdown-item" to="/vacancies">Вакансії</Link></li>
                    </ul>
                  </li>



                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdownParents" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.preventDefault()} >
                      Інформаційна <br /> відкритість
                      <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 4 6 8 10 4" />
                      </svg>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownParents">
                      <li><Link className="dropdown-item" to="/internal-documents/all">Нормативні документи</Link></li>
                      <li><Link className="dropdown-item" to="/area">Територія обслуговування</Link></li>
                      <li><Link className="dropdown-item" to="/language">Мова освітнього процесу</Link></li>
                      <li><Link className="dropdown-item" to="/facilities">Матеріально-технічне забезпечення</Link></li>
                      <li><Link className="dropdown-item" to="/services">Додаткові освітні послуги</Link></li>
                      <li><Link className="dropdown-item" to="/family-education">Сімейна форма навчання</Link></li>
                      <li><Link className="dropdown-item" to="/rules">Правила поведінки</Link></li>
                      <li><Link className="dropdown-item" to="/instructions">Інструкції, пам’ятки</Link></li>                      
                      <li><Link className="dropdown-item" to="/bullying">Протидія булінгу</Link></li>
                      <li><Link className="dropdown-item" to="/programs">Освітні програми</Link></li>
                      <li><Link className="dropdown-item" to="/certifications">Атестація педагогічних працівників</Link></li>
                      <li><Link className="dropdown-item" to="/criteria">Критерії оцінювання </Link></li>
                    </ul>
                  </li>


                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdownTeachers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Наші <br /> досягнення
                      <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 4 6 8 10 4" />
                      </svg>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownTeachers">
                      <li><a className="dropdown-item" href="/school-rating">Рейтинг</a></li>
                      <li><a className="dropdown-item" href="/school-medals">Медалісти</a></li>
                      <li><a className="dropdown-item" href="/olympiads">Олімпіади</a></li>
                      <li><a className="dropdown-item" href="#">Успішний вчитель</a></li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdownTeachers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Учням <br />та батькам
                      <svg className="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 4 6 8 10 4" />
                      </svg>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownTeachers">
                      <li><a className="dropdown-item" href="/school-timetable">Розклад уроків</a></li>
                      <li><a className="dropdown-item" href="/school-bells">Розклад дзвінків</a></li>
                      <li><a className="dropdown-item" href="#">Графік гуртків</a></li>
                      <li><a className="dropdown-item" href="#">Благодійні внески</a></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Вступ у гімназію</a>
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
