import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Topbar from "./components/Topbar";
import Header from "./components/Header"
import Home from "./components/Home";
import Posts from "./components/Posts"
import PostDetail from "./components/PostDetail";
import EditPost from "./components/EditPost";
import "./App.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);

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
      </Routes>
      </main>
      {/* Підвал */}
      <footer className="footer">
        <p>&copy; 2025 Ваша Школа. Усі права захищені.</p>
      </footer>
    </Router>
  );
};

export default App;
