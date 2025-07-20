import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Topbar from "./components/Topbar";
import Header from "./components/Header"
import Home from "./components/Home";
import Posts from "./components/Posts"
import PostDetail from "./components/PostDetail";
import EditPost from "./components/EditPost";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import NewsletterSection from "./components/HomePage/NewsletterSection";
import AboutPage from './components/Pages/About/AboutPage';

import "./App.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App = () => {
   const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Router>
      <Topbar />
      <Header />
      
      <main>
      {/* Контент */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} /> 
        <Route path="/edit/:id" element={<EditPost />} />

        <Route path="/about" element={<AboutPage user={user} />} />
      </Routes>
      
      </main>
      <NewsletterSection />
      <Footer />
      <ScrollToTop />
     
    </Router>
  );
};

export default App;
