import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TextEditor from "./TextEditorNew";
import DatePicker from "react-datepicker";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";
import './Post.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", updatedAt: "", });
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [editor, setEditor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");

  const contentRef = useRef("");
  const titleRef = useRef("");
  const dateRef = useRef();

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

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Форматуємо дату як YYYY-MM-DD
    if (dateRef.current) {
      dateRef.current.value = formattedDate; // Встановлюємо значення в інпут
    }
  }, []);

  useEffect(() => {
    if (editor && editingPost) {
      editor.commands.setContent(editContent);
    }
  }, [editContent, editor, editingPost]);

  // Обробка зміни заголовка
  const handleInputChange = (e) => {
    titleRef.current.value = e.target.value;  // Оновлюємо значення titleRef
  };

  // Обробка зміни контенту в редакторі
  const handleEditorChange = (value) => {
    if (editingPost) {
      setEditContent(value); // Якщо редагуємо — змінюємо editContent
    } else {
      contentRef.current = value;  // Оновлюємо значення contentRef
    }

  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Функція очищення редактора
  const handleClear = () => {
    if (editor) {
      editor.chain().focus().clearContent().run(); // Очищаємо контент редактора
    }
    setNewPost({ title: "", content: "" }); // Очищаємо стейт
  };

  const handleAddPost = async (e) => {
    e.preventDefault();

    // Отримуємо дату в локальному часі
    const localDate = new Date(selectedDate);

    // Перевірка значення дати
    const formattedDate = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;

    console.log('Selected date:', formattedDate);  // Дивись в консоль, щоб перевірити, чи правильна дата


    const updatedPost = {
      title: titleRef.current.value,
      content: contentRef.current,
      updatedAt: formattedDate,
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

      setNewPost({ title: "", content: "", updatedAt: "" });  // Очищаємо форму після додавання поста
      titleRef.current.value = "";  // Очищаємо titleRef
      contentRef.current = "";  // Очищаємо contentRef
      setSelectedDate(new Date());
      handleClear();
    } catch (err) {
      console.error("Error adding post:", err.response ? err.response.data : err);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditDate(new Date(post.updatedAt));
    setSelectedDate(new Date(post.updatedAt)); 

    if (titleRef.current) {
      titleRef.current.value = post.title; // Заповнюємо поле заголовка
    }
    setTimeout(() => {
      if (editor) {
        editor.commands.setContent(post.content);
      }
    }, 100);
    setSelectedDate(new Date(post.updatedAt)); // Встановлюємо вибрану дату
  };


  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (!editingPost) return;

    console.log("🔄 Оновлення поста:", editingPost.id);

    const formattedDate = editDate.toISOString().split("T")[0]; 

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${editingPost.id}`,
        {
          title: titleRef.current.value, 
          content: editContent,
          updatedAt: formattedDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Пост оновлено:", response.data);

      if (!response.data) throw new Error("Помилка оновлення поста");

      setPosts(posts.map((post) => (post.id === editingPost.id ? response.data : post)));

      // Очищаємо редагування
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
      setEditDate("");
      titleRef.current.value = "";
      contentRef.current = "";
      setSelectedDate(new Date());
      handleClear();
    } catch (error) {
      console.error("Помилка оновлення поста:", error);
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

        setPosts(posts.filter((post) => post.id !== postId)); // Оновлюємо стан
        Swal.fire('Видалено!', 'Пост успішно видалено.', 'success');  // Повідомлення про успішне видалення
      }
    } catch (error) {
      console.error('Помилка:', error.message);
      Swal.fire('Помилка!', 'Не вдалося видалити пост.', 'error');
    }
  };

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div>
      <h1>Новини</h1>

      {user && (
        <div className="news-form-container">
          <h2 className="news-form-title">Додати новину</h2>
          <form className="news-form" onSubmit={editingPost ? handleUpdatePost : handleAddPost}>
            <input
              type="text"
              name="title"
              placeholder="Заголовок новини"
              //defaultValue={newPost.title}
              ref={titleRef}
              onChange={handleInputChange}
              required
              className="news-input"
            />
            <TextEditor
              key={editingPost ? editingPost.id : "new"}
              content={editingPost ? editContent : newPost.content}
              setContent={handleEditorChange}
              editor={editor}
              setEditor={setEditor}
            />


            <DatePicker
              selected={editingPost ? editDate : selectedDate}
              onChange={(date) => {
                if (editingPost) {
                  setEditDate(date);
                } else {
                  setSelectedDate(date);
                }
              }}
              dateFormat="dd/MM/yyyy"  // Формат відображення
              className="news-input"
            />

            <button type="submit" className="news-submit-button">
              {editingPost ? "Оновити новину" : "Додати новину"}
            </button>

            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setEditTitle("");
                  setEditContent("");
                  setEditDate(null);
                }}
                className="cancel-button"
              >
                Скасувати редагування
              </button>
            )}
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
                <div dangerouslySetInnerHTML={{ __html: decodeHTML(post.content) }} />
                <p>Дата: {new Date(post.updatedAt).toLocaleDateString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}</p>
                <button onClick={() => handleEditPost(post)} className="edit-button">
                  <FaEdit size={20} />
                </button>
                <button onClick={() => handleDeletePost(post.id)} className="delete-button">
                  <FaTrash size={20} /> {/* Іконка для видалення */}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Posts;
