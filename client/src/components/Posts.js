import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TextEditor from "./TextEditor";
import DatePicker from "react-datepicker";
import {
  Card, CardMedia, CardContent, Tooltip, Typography,
  Box, IconButton, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [postData, setPostData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const postsPerPage = 12;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Отримання всіх новин при завантаженні сторінки
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);

        setPosts(response.data);
      } catch (err) {
        console.error("❌ Error fetching posts:", err.response ? err.response.data : err);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const result = await Swal.fire({
        title: 'Ви впевнені?',
        text: "Цей пост буде видалено!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Так, видалити!',
        cancelButtonText: 'Скасувати',
      });

      if (result.isConfirmed) {
        // Якщо користувач підтвердив
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          let errorText;
          try {
            const errorData = await response.json();
            errorText = errorData.error;
          } catch {
            errorText = await response.text();
          }
          throw new Error(errorText || 'Помилка видалення поста');
        }

        setPosts(posts.filter((post) => post.id !== postId));
        Swal.fire('Видалено!', 'Пост успішно видалено.', 'success');
        navigate("/posts");
      }
    } catch (error) {
      console.error('Помилка:', error.message);
      Swal.fire('Помилка!', 'Не вдалося видалити пост.', 'error');
    }
  };

  const handleClick = async (postId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`);
      const data = await response.json();
      setPostData(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const getMainImage = (content) => {
    if (!content) return "/placeholder.jpg"; 
  
    try {
      //const decodedContent = JSON.parse(`"${content}"`);
  
      const div = document.createElement("div");
      div.innerHTML = content;
  
      const imgElement = div.querySelector("img");
  
      return imgElement ? imgElement.src : "/placeholder.jpg"; 
    } catch (error) {
      console.error("Помилка під час обробки контенту:", error);
      return "/placeholder.jpg"; // У разі помилки повертаємо дефолтну картинку
    }
  };
  

  return (
    <div>
     
      <div className="news-container">
        <div className="news-header">
          <h1>Новини</h1>
          {user && user.role === "admin" && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />} // Додаємо іконку
              onClick={() => navigate("/edit/new")}
            >
              Додати новину
            </Button>
          )}
        </div>
        <Pagination
                count={Math.ceil(posts.length / postsPerPage)} // Загальна кількість сторінок
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)} // Оновлюємо сторінку
                className="activePage"
                sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}
              />
        {posts.length === 0 ? (
          <p>Немає новин.</p>
        ) : (
          <div>
          <div className="news-grid">

            {currentPosts.map((post) => (
              <Link to={`/posts/${post.id}`} className="news-link" onClick={() => handleClick(post.id)}>
                <Card
                  sx={{
                    maxWidth: 345,
                    height: 400,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    '&:hover .admin-buttons': { opacity: 1 }, // Показує кнопки при наведенні на картку
                  }}
                >
                  {/* Кнопки редагування та видалення */}
                  {user && user.role === "admin" && (
                    <Box
                      className="admin-buttons"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                        opacity: 0, // Приховує кнопки за замовчуванням
                        transition: "opacity 0.3s ease", // Плавний перехід
                      }}
                    >
                      <Tooltip title="Редагувати пост">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation(); // Запобігає переходу по <Link>
                            e.preventDefault(); // Запобігає стандартному переходу браузера
                            navigate(`/edit/${post.id}`);
                          }}
                          sx={{
                            color: "primary.main",
                            backgroundColor: "white",
                            '&:hover': { backgroundColor: "#f0f0f0" },
                          }}
                        >
                          <FaEdit size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Видалити пост">
                        <IconButton
                          onClick={() => handleDeletePost(post.id)}
                          sx={{
                            color: "error.main",
                            backgroundColor: "white",
                            '&:hover': { backgroundColor: "#f0f0f0" },
                          }}
                        >
                          <FaTrash size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="280"
                    image={getMainImage(post.content)}
                    alt={post.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(post.updatedAt).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography variant="h6" color="textPrimary"
                      sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,   // кількість рядків
                        WebkitBoxOrient: "vertical",
                      }}>
                      {post.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
              
          </div>
          <Pagination
                count={Math.ceil(posts.length / postsPerPage)} // Загальна кількість сторінок
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)} // Оновлюємо сторінку
                color="primary"
                sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
              />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Posts;
