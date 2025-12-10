import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";


const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      console.log('API_BACKEND_URL:', API_BACKEND_URL)
      
      const response = await axios.post(`${API_BACKEND_URL}/login`, 
        { username, password  },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate("/"); // Redirect after successful login

      } else {
        console.error("❌ Токен не отримано з сервера.");
      }
    } catch (err) {
      setError("Error retriving token from backend", err);
      console.error("❌ Помилка авторизації:", err.response ? err.response.data : err);
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleLogin} method="POST" className="login-form">
        <h2>Увійти в систему</h2>
        <div>
          <label>Логін:</label> 
          <input
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="password"
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginForm;
