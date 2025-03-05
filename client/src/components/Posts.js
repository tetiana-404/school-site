import React, { useState, useEffect, useRef  } from "react";
import axios from "axios";
import TextEditor from "./TextEditorNew";
//import { useNavigate } from "react-router-dom";
import './Post.css';


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [previewContent, setPreviewContent] = useState("");
  const [user, setUser] = useState(localStorage.getItem("user") || null); 
  const contentRef = useRef("");

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

  const handleEditorChange = (value) => {
    contentRef.current = value; // Оновлюємо useRef, але не викликаємо ререндер
  };

  // Оновлення попереднього перегляду
  const handleUpdatePreview = () => {
    setPreviewContent(contentRef.current); // Оновлюємо попередній перегляд тільки після натискання кнопки
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
      setNewPost((prev) => ({ ...prev, content: "" }));  
      contentRef.current = "";
      setPreviewContent("");
    } catch (err) {
      console.error("Error adding post:", err.response ? err.response.data : err);
    }
  };

const clearEditor = () => {
    setNewPost((prev) => ({ ...prev, content: '' })); // Очищає textarea та Output
    setPreviewContent("");
};
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};
  return (
    <div>
      <h1>Новини</h1>
      
      {/* Якщо користувач залогований, показуємо форму для додавання новини */}
      {user && (
        <div class="news-form-container">
           <h2 class="news-form-title">Додати новину</h2>
          <form class="news-form" onSubmit={handleAddPost}>
            <input
              type="text"
              name="title"
              placeholder="Заголовок новини"
              value={newPost.title}
              onChange={handleInputChange}
              required
              class="news-input"
            />
            <textarea
              name="content"
              placeholder="Текст новини"
              value={contentRef.current}
              onChange={(e) => {
                contentRef.current = e.target.value; // Оновлюємо useRef
                setNewPost((prevPost) => ({ ...prevPost, content: e.target.value })); // Щоб інші частини форми бачили зміни
              }}
              required
              class="news-textarea"
            />
            <TextEditor
              content={contentRef.current}
              setContent={handleEditorChange}
              clearEditor={clearEditor}
            />
            <button type="button" className="news-preview-button" onClick={handleUpdatePreview}>
              Оновити
            </button>
            <button type="submit" class="news-submit-button">Додати новину</button>
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
                {/*<p>{post.content}</p>
                <p dangerouslySetInnerHTML={{ __html: post.content }}></p>*/}
                <p dangerouslySetInnerHTML={{ __html: decodeHTML(post.content) }}></p>
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
