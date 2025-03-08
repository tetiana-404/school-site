import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TextEditor from "./TextEditorNew";
import { Editor } from "@tiptap/react";
import './Post.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [editor, setEditor] = useState(null); 
  const contentRef = useRef("");  // Використовуємо реф для редактора
  const titleRef = useRef("");    // Використовуємо реф для назви

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

  // Обробка зміни заголовка
  const handleInputChange = (e) => {
    titleRef.current = e.target.value;  // Оновлюємо значення titleRef
  };

  // Обробка зміни контенту в редакторі
  const handleEditorChange = (value) => {
    contentRef.current = value;  // Оновлюємо значення contentRef
  };

  // Функція очищення редактора
  const handleClear = () => {
    if (editor) {
      editor.chain().focus().clearContent().run(); // Очищаємо контент редактора
    }
    setNewPost({ title: "", content: "" }); // Очищаємо стейт
  };

  // Додавання нової новини
  const handleAddPost = async (e) => {
    e.preventDefault();

    // Оновлюємо стейт перед відправкою, включаючи контент і заголовок
    const updatedPost = {
      title: titleRef.current,       // Оновлюємо заголовок
      content: contentRef.current,   // Оновлюємо контент
    };

    try {
      // Перевіряємо токен для аутентифікації
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

      // Надсилаємо запит для створення нового поста
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/posts`,
        updatedPost,
        config
      );

      console.log("Post added:", response.data);
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      
      setNewPost({ title: "", content: "" });  // Очищаємо форму після додавання поста
      titleRef.current = "";  // Очищаємо titleRef
      contentRef.current = "";  // Очищаємо contentRef
      handleClear();
    } catch (err) {
      console.error("Error adding post:", err.response ? err.response.data : err);
    }
  };

  return (
    <div>
      <h1>Новини</h1>

      {user && (
        <div className="news-form-container">
          <h2 className="news-form-title">Додати новину</h2>
          <form className="news-form" onSubmit={handleAddPost}>
            <input
              type="text"
              name="title"
              placeholder="Заголовок новини"
              defaultValue={newPost.title}
              onChange={handleInputChange}
              required
              className="news-input"
            />
            <TextEditor content={newPost.content} setContent={handleEditorChange} editor={editor} setEditor={setEditor} />
            
            <button type="submit" className="news-submit-button">Додати новину</button>
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
                <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
                <p>Дата: {new Date(post.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Posts;
