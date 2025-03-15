import React, { useState } from 'react';
import { FiLogIn, FiLogOut } from "react-icons/fi"; 
import { Link } from "react-router-dom";

const Header = () => {
    const [user, setUser] = useState(localStorage.getItem("user") || null);
  
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      };
    return (
    <header className="header">
      {/* Слайдер */}
      <div id="headerCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://via.placeholder.com/1920x600" className="d-block w-100" alt="Slide 1" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Заголовок слайду</h5>
              <p>Опис слайду на фоні</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://via.placeholder.com/1920x600" className="d-block w-100" alt="Slide 2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Заголовок слайду 2</h5>
              <p>Опис слайду 2</p>
            </div>
          </div>
        </div>

        {/* Кнопки слайдера */}
        <button className="carousel-control-prev" type="button" data-bs-target="#headerCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Попередній</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#headerCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Наступний</span>
        </button>
      </div>

      {/* Меню */}
      <h1 className="slogan">Будуємо майбутнє разом!</h1>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Школа</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Перемикач навігації">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#">Головна</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/posts">Новини</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Контакти</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Про нас</a>
              </li>
              {!user ? (
            <li>
              <Link to="/login">
                <FiLogIn size={20} /> {/* Іконка входу */}
              </Link>
            </li>
          ) : (
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut size={20} /> {/* Іконка виходу */}
              </button>
            </li>
          )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
