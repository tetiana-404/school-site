import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Container, Card, CardContent, Typography, CircularProgress,
  Box, Tooltip, IconButton } from "@mui/material";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

function PostDetail() {
  const { id } = useParams();  // Отримуємо id з URL
  const [postData, setPostData] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const navigate = useNavigate();

  const titleRef = useRef("");


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
    fetchPost();
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
    <Container maxWidth="lg" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      {postData ? (
        <Card sx={{ boxShadow: 3, position: "relative" }}>
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
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom align="center" color="primary">
              {postData.title}
            </Typography>

            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",

              }}
              dangerouslySetInnerHTML={{ __html: decodeHTML(postData.content) }}
            />

            <Typography variant="body2" color="textSecondary" align="left">
              <strong>Дата:</strong> {new Date(postData.updatedAt).toLocaleDateString("uk-UA")}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
}

export default PostDetail;
