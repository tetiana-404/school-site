import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Container, Card, CardContent, Typography, CircularProgress,
  Box, Tooltip, IconButton
} from "@mui/material";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EditPost from "./EditPost";

function PostDetail() {
  const { id } = useParams();  // Отримуємо id з URL
  const [postData, setPostData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [isEdit, setIsEdit] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`);
        if (!response.ok) throw new Error("Не вдалося отримати пост.");
        const data = await response.json();
        setPostData(data);  // Зберігаємо дані поста в стейт
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        if (!response.ok) throw new Error("Не вдалося отримати список новин.");
        const data = await response.json();
        setAllPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPost();
    fetchAllPosts();
  }, [id]);  // Викликаємо fetch при зміні id

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

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
          const errorData = await response.json();
          throw new Error(errorData.error || 'Помилка видалення поста');
        }

        Swal.fire('Видалено!', 'Пост успішно видалено.', 'success');
        navigate("/posts");
      }
    } catch (error) {
      console.error('Помилка:', error.message);
      Swal.fire('Помилка!', 'Не вдалося видалити пост.', 'error');
    }
  };

  return (
    <>
      <section id="postDetails" className="section-padding">
        <div className="auto-container">
          <div className="row mb-lg-5 mb-0">
            <div className="col-lg-8 col-md-8 col-sm-12 col-12">
              {postData ? (
                <div className="sidebar-widget-inner position-relative">
                  {/* Кнопки редагування та видалення */}
                  {user && user.role === "admin" && (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation(); // Запобігає переходу по <Link>
                        e.preventDefault(); // Запобігає стандартному переходу браузера
                        navigate(`/edit/${id}`);
                      }}
                      className="admin-buttons"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                        transition: "opacity 0.3s ease", // Плавний перехід
                      }}
                    >
                      <Tooltip title="Редагувати пост">
                        <IconButton

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
                          onClick={() => handleDeletePost(postData.id)}
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
                  <h4 className="sidebar-widget-title">{postData.title}</h4>
                  <div
                    dangerouslySetInnerHTML={{ __html: decodeHTML(postData.content) }}
                  />

                  <p><b>{new Date(postData.updatedAt).toLocaleDateString("uk-UA")}</b></p>
                </div>
              ) : (
                <CircularProgress />
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-12 mt-lg-0 mt-md-0 mt-5 pl-lg-5 pl-md-5 pl-0">
              <div className="service-des">
                <div className="px-3">
                  <h4 className="title">Інші новини</h4>
                </div>
                <List>
                  {allPosts
                    .filter((post) => post.id !== id) // Виключаємо поточну новину
                    .slice(0, 10) // Обмежуємо до 10 останніх новин
                    .map((post) => (
                      <ListItemButton key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                        <ListItemText
                          primary={post.title}
                          secondary={new Date(post.updatedAt).toLocaleDateString("uk-UA")}
                        />
                      </ListItemButton>
                    ))}
                </List>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
}

export default PostDetail;
