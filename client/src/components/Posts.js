import React, { useState, useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Card, CardMedia, CardContent, Tooltip, Typography, useMediaQuery, TextField,
  Box, IconButton, Button, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [postsArray, setPostsArray] = useState([]);
  const [groupedPosts, setGroupedPosts] = useState({});
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [expandedYear, setExpandedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const [pageByYear, setPageByYear] = useState({});
  const [query, setQuery] = useState("");
  const POSTS_PER_PAGE = 15;
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));



  // Завантаження всіх постів
  useEffect(() => {
    const fetchPosts = async () => {
      
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
          params: { search: query, limit: POSTS_PER_PAGE },
        });

        const posts = res.data.posts; // це масив
        setPostsArray(posts);

        // сортуємо і групуємо по роках
        const grouped = posts
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .reduce((acc, post) => {
            const year = new Date(post.updatedAt).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(post);
            return acc;
          }, {});

        setGroupedPosts(grouped);
        // Ініціалізація сторінок
        Object.keys(grouped).forEach(year => {
          setPageByYear(prev => ({ ...prev, [year]: 1 }));
        });

      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [query]);

  const years = Object.keys(groupedPosts).sort((a, b) => b - a);

  const handleChangeYear = (year) => (event, isExpanded) => {
    setExpandedYear(isExpanded ? year : false);

    if (!pageByYear[year]) {
      setPageByYear((prev) => ({ ...prev, [year]: 1 }));
    }
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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Помилка видалення поста');
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

  const getMainImage = (content) => {
    if (!content) return "/placeholder.jpg";
    try {
      const div = document.createElement("div");
      div.innerHTML = content;
      const imgElement = div.querySelector("img");
      return imgElement ? imgElement.src : "/placeholder.jpg";
    } catch (error) {
      console.error("Помилка під час обробки контенту:", error);
      return "/placeholder.jpg";
    }
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Новини</h1>
        {user && user.role === "admin" && (
          <Button
            variant="contained"
            className="btn btn-outlines"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/edit/new")}
          >
            {isLarge && "Додати новину"}
          </Button>
        )}
      </div>
      <div>
        <TextField
          label="Пошук новин"
          variant="outlined"
          size="small"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
      </div>
      {years.map((year) => {
        const postsForYear = groupedPosts[year] || [];
        const page = pageByYear[year] || 1;
        const totalPages = Math.ceil(postsForYear.length / POSTS_PER_PAGE);
        const paginatedPosts = postsForYear.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
        
        return (
          <Accordion
            key={year}
            expanded={expandedYear === parseInt(year)}
            onChange={handleChangeYear(parseInt(year))}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">{year}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="news-grid">

                {paginatedPosts.map((post) => (
                  <Link to={`/posts/${post.id}`} key={post.id} className="news-link">
                    <Card
                      sx={{
                        width: "100%",
                        maxWidth: { xs: 245, sm: 345, md: 345 },
                        height: "100%",
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        '&:hover .admin-buttons': { opacity: 1 },
                      }}
                    >
                      {user && user.role === "admin" && (
                        <Box
                          className="admin-buttons"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            display: "flex",
                            gap: 1,
                            opacity: { xs: 1, sm: 1, md: 0 },
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          <Tooltip title="Редагувати пост">
                            <IconButton
                              onClick={(e) => {
                                e.preventDefault();
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
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeletePost(post.id);
                              }}
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
                        sx={{
                          width: "100%",
                          height: { xs: 200, sm: 250, md: 280 },
                          objectFit: "cover",
                        }}
                        image={getMainImage(post.content)}
                        alt={post.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(post.updatedAt).toLocaleDateString("uk-UA")}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="textPrimary"
                          sx={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {/* ✅ Пагінація */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    variant="outlined"
                    className="btn btn-outlines"
                    disabled={page === 1}
                    onClick={() =>
                      setPageByYear((prev) => ({ ...prev, [year]: page - 1 }))
                    }
                  >
                    Попередня
                  </Button>
                  <span className="text-center">
                    Сторінка {page} з {totalPages}
                  </span>
                  <Button
                    variant="outlined"
                    className="btn btn-outlines"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPageByYear((prev) => ({ ...prev, [year]: page + 1 }))
                    }
                  >
                    Наступна
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default Posts;
