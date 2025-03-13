import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import Posts from "./components/Posts"
import PostDetail from "./components/PostDetail";
import EditPost from "./components/EditPost";
import "./App.css"; // Підключаємо стилі
import { FiMenu, FiX, FiLogIn, FiLogOut } from "react-icons/fi"; // Іконки бургер-меню

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {/* Шапка */}
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="School Logo" className="logo" />
          <h1 className="slogan">Навчання – це шлях до успіху!</h1>
        </div>
      </header>

      {/* Навігація */}
      <nav className="navbar">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </div>
        <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
          <li><Link to="/posts">Новини</Link></li>
          <li><Link to="#">Для учнів</Link></li>
          <li><Link to="#">Для батьків</Link></li>
          <li><Link to="#">Для вчителів</Link></li>
          <li><Link to="#">Психолог</Link></li>
          <li><Link to="#">Публічна інформація</Link></li>
          <li><Link to="#">Контакти</Link></li>
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
      </nav>

      {/* Контент */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} /> 
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>

      {/* Підвал */}
      <footer className="footer">
        <p>&copy; 2025 Ваша Школа. Усі права захищені.</p>
      </footer>
    </Router>
  );
};

export default App;
