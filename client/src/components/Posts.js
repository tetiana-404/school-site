import React, { useState, useEffect } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
//import { useNavigate } from "react-router-dom";


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [user, setUser] = useState(localStorage.getItem("user") || null); 
  //const navigate = useNavigate();

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

  // Обробка зміни значень у формі для нової новини
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  // Додавання нової новини
  const handleAddPost = async (e) => {
    e.preventDefault();

    try {
      // Додавання нового поста з токеном для аутентифікації
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("Користувач не авторизований!");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
     // Додаємо новий пост
     const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        newPost,
        config
      );
  
      console.log("Post added:", response.data);
  
      // Оновлюємо локальний список, додаючи новий пост в початок
      setPosts((prevPosts) => [response.data, ...prevPosts]);
  
      setNewPost({ title: "", content: "" }); // Очищення форми після додавання
  
    } catch (err) {
      console.error("Error adding post:", err.response ? err.response.data : err);
    }
  };  

  return (
    <div>
      <h1>Новини</h1>
      
      {/* Якщо користувач залогований, показуємо форму для додавання новини */}
      {user && (
        <div>
          <h2>Додати новину</h2>
          <form onSubmit={handleAddPost}>
            <input
              type="text"
              name="title"
              placeholder="Заголовок новини"
              value={newPost.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="content"
              placeholder="Текст новини"
              value={newPost.content}
              onChange={handleInputChange}
              required
            />
            <TextEditor
              content={newPost.content}
              setContent={(value) => setNewPost((prev) => ({ ...prev, content: value }))}
            />

            <button type="submit">Додати новину</button>
          </form>
        </div>
      )}

      <div>
        <h2>Список новин</h2>
        {posts.length === 0 ? (
          <p>Немає новин.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
                <p>Дата:  {new Date(post.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Posts;
