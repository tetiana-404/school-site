import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import TextEditor from "./TextEditor";
import DatePicker from "react-datepicker";
import axios from "axios";
import './EditPost.css'

function EditPost({ onSave, onClose } ) {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", content: "", updatedAt: "", });
    const [editor, setEditor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    //const [title, setTitle] = useState("");
    //const [content, setContent] = useState("");

    const [editingPost, setEditingPost] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editDate, setEditDate] = useState("");

    const contentRef = useRef("");
    const titleRef = useRef("");
    const dateRef = useRef();

    const user = JSON.parse(localStorage.getItem("user")) || null;
    const isNewPost = id === "new";
    const navigate = useNavigate();

    useEffect(() => {
        if (!isNewPost) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setEditingPost(data);
                    setEditTitle(data.title);
                    setEditContent(data.content);
                    setEditDate(new Date(data.updatedAt));

                    if (titleRef.current) {
                        titleRef.current.value = data.title; // Заповнюємо поле заголовка
                    }
                });
        }
    }, [id, isNewPost]);

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

    const handleAddPost = async (e) => {
        e.preventDefault();

        // Отримуємо дату в локальному часі
        const localDate = new Date(selectedDate);

        // Перевірка значення дати
        const formattedDate = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;

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

            setPosts((prevPosts) => [response.data, ...prevPosts]);

            setNewPost({ title: "", content: "", updatedAt: "" });  // Очищаємо форму після додавання поста
            titleRef.current.value = "";  // Очищаємо titleRef
            contentRef.current = "";  // Очищаємо contentRef
            setSelectedDate(new Date());
            handleClear();

            window.scrollTo(0, 0);
            setEditingPost(null);        // прибираємо форму
            if (typeof onSave === "function") onSave(response.data);
            navigate(`/posts/${response.data.id}`);

        } catch (err) {
            console.error("Error adding post:", err.response ? err.response.data : err);
        }
    };

    // Функція очищення редактора
    const handleClear = () => {
        if (editor) {
            editor.chain().focus().clearContent().run(); // Очищаємо контент редактора
        }
        setNewPost({ title: "", content: "" }); // Очищаємо стейт
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();

        if (!editingPost) return;

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

            if (!response.data) throw new Error("Помилка оновлення поста");

            setPosts(posts.map((post) => (post.id === editingPost.id ? response.data : post)));

            window.scrollTo(0, 0);
            setEditingPost(null);        // прибираємо форму
            if (typeof onSave === "function") onSave(response.data);
            navigate(`/posts/${response.data.id}`);
            

        } catch (error) {
            console.error("Помилка оновлення поста:", error);
        }
    };

    return (
        <div>
            {user && user.role === "admin" && (
                <div className="news-form-container">
                    <h2 className="news-form-title">{isNewPost ? "Додати новину" : "Редагувати новину"}</h2>
                    <form className="news-form" onSubmit={isNewPost ? handleAddPost : handleUpdatePost}>
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
                            selected={isNewPost ? selectedDate : editDate}
                            onChange={(date) => isNewPost ? setSelectedDate(date) : setEditDate(date)}
                            dateFormat="dd/MM/yyyy"  // Формат відображення
                            className="news-input"
                        />

                        <div className="button-group fixed-bottom-actions text-center mt-5">
                            <button type="submit" className="btn btn-outline-success btn-lg" >
                                <span>{isNewPost ? "💾 Додати" : "💾 Оновити"}</span>
                            </button>


                            {!isNewPost && (
                                <button className="btn btn-outline-warning btn-lg"
                                    onClick={() => {
                                        if (typeof onClose === "function") {
                                            onClose(); 
                                        }
                                        window.scrollTo(0, 0); 
                                    }}
                                >❌ Скасувати</button>
                            )}
                        </div>


                    </form>
                </div>
            )}
        </div>
    )
}

export default EditPost;
