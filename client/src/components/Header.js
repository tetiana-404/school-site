import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import "./Header.css"



const Header = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);

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
      // Перевіряємо ширину
      if (window.innerWidth >= 992) {
        if (window.pageYOffset >= stickyOffset) {
          menu.classList.add('sticky-fixed');
        } else {
          menu.classList.remove('sticky-fixed');
        }
      } else {
        // На мобілках sticky прибираємо завжди
        menu.classList.remove('sticky-fixed');
      }
    };


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyOffset]);


  return (
    <header className="header">
      <div className="container py-2 py-md-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100">
          <div className="mb-3 mb-md-0">
            <Link to="/"> <img
              src={process.env.PUBLIC_URL + '/img/logo.png'}
              alt="Євшан"
              className="img-fluid"
              style={{ maxWidth: "250px" }}
            /></Link>
          </div>

          <div className="contact-info d-none d-md-flex flex-wrap justify-content-center justify-content-md-end align-items-center text-center text-md-end gap-3">
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
            <div className="container-fluid d-flex justify-content-end">
              <button 
                className="navbar-toggler my-2" 
                style={{ outline: 'none', boxShadow: 'none', border: 0, marginRight: '-25px' }} 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Навігація"
              >
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
                      id="dropdownAbout"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Про нас
                      
                    </a>
                    
                    <ul className="dropdown-menu" aria-labelledby="dropdownAbout">
                      <li><Link className="dropdown-item" to="/about">Загальна інформація</Link></li>
                      <li><Link className="dropdown-item" to="/history">Історія</Link></li>
                      <li><Link className="dropdown-item" to="/anthem">Гімн гімназії</Link></li>
                      <li><Link className="dropdown-item" to="/documents">Установчі документи</Link></li>
                      <li><Link className="dropdown-item" to="/strategy">Стратегія розвитку гімназії</Link></li>
                      <li><Link className="dropdown-item" to="/reports">Звіти директора</Link></li>
                      <li><Link className="dropdown-item" to="/teachers">Кадровий склад</Link></li>
                      <li><Link className="dropdown-item" to="/vacancies">Вакансії</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="dropdownParents" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.preventDefault()} >
                      Інформація
                      
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
                    <a className="nav-link dropdown-toggle" id="dropdownTeachers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Досягнення
                      
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownTeachers">
                      <li><Link className="dropdown-item" to="/school-rating">Рейтинг</Link></li>
                      <li><Link className="dropdown-item" to="/school-medals">Медалісти</Link></li>
                      <li><Link className="dropdown-item" to="/olympiads">Олімпіади</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="dropdownTeachers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Учні / Батьки
                      
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownTeachers">
                      <li><Link className="dropdown-item" to="/school-timetable">Розклад уроків</Link></li>
                      <li><Link className="dropdown-item" to="/school-bells">Розклад дзвінків</Link></li>
                      <li><Link className="dropdown-item" to="/school-clubs-timetable">Графік гуртків</Link></li>
                      <li><Link className="dropdown-item" to="/donations">Благодійні внески</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admission">Вступ</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/finance">Фінанси</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">Контакти</Link>
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
