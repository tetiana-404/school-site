import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { Box, Tooltip, IconButton } from "@mui/material";
import Swal from 'sweetalert2';
import EditPost from "./EditPost"; 

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const postsPerPage = 10;


  const user = JSON.parse(localStorage.getItem("user")) || null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`);
        if (!response.ok) throw new Error("Не вдалося отримати пост.");
        const data = await response.json();
        setPostData(data);
      } catch (err) {
        setError("Не вдалося завантажити пост");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`);
        if (!response.ok) throw new Error("Не вдалося отримати список новин.");
        const data = await response.json();
        //setAllPosts(data);
        setAllPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPost();
    fetchAllPosts();
  }, [id]);

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

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;
  if (!postData) return <p>Пост не знайдено</p>;

  return (
    <>
      <section id="postDetails" className="section-padding">
        <div className="auto-container">
          <div className="row mb-lg-5 mb-0">
            <div className="col-lg-8 col-md-8 col-sm-12 col-12">
               <div className="sidebar-widget-inner position-relative">
              {isEditing ? (
                // ✅ Inline EditPost
                <EditPost
                  id={id}                     // передаємо id
                  initialData={postData}      // передаємо дані (щоб не вантажити вдруге)
                  onClose={() => setIsEditing(false)} // вихід з редагування
                  onSave={(updated) => {
                    setPostData(updated);     // оновлюємо відразу на сторінці
                    setIsEditing(false);
                  }}
                />
              ) : (
                <>
                      {user && user.role === "admin" && (
                        <Box
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
                              onClick={() => setIsEditing(true)}
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
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                    className="post-content"
                  />
                  <p>
                    <b>{new Date(postData.updatedAt).toLocaleDateString("uk-UA")}</b>
                  </p>

                 
                </>
              )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-12 mt-lg-0 mt-md-0 mt-5 pl-lg-5 pl-md-5 pl-0">
              <div className="service-des">
                <div className="px-3">
                  <h4 className="title">Інші новини</h4>
                </div>
                <List>
                  {allPosts
                    .filter((post) => post.id !== Number(id)) 
                    .slice(startIndex, startIndex + postsPerPage) 
                    .map((post) => (
                      <ListItemButton key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                        <ListItemText
                          primary={post.title}
                          secondary={new Date(post.updatedAt).toLocaleDateString("uk-UA")}
                        />
                      </ListItemButton>
                    ))}
                </List>
                <div className="pagination-buttons">
                  <button
                    onClick={() => setStartIndex(Math.max(0, startIndex - postsPerPage))}
                    disabled={startIndex === 0}
                  >
                    ◀ Попередні
                  </button>
                  <button
                    onClick={() => setStartIndex(startIndex + postsPerPage)}
                    disabled={startIndex + postsPerPage >= allPosts.filter(post => post.id !== Number(id)).length}
                  >
                    Наступні ▶
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PostDetail;
