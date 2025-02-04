import React, { useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const TextEditor = ({ content, setContent }) => {
    const quillRef = useRef(null);

    // Функція обробника завантаження зображень
    const imageHandler = useMemo((event) => {
        return () => {

            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                    handleMediaUpload(file, "image");
                }
            };
        };
    }, []);

    // Завантаження медіа файлів на сервер
    const handleMediaUpload = async (file, type) => {
        console.log("Uploading file...", file.name);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            console.log("Sending file to server...");

            const API_URL = process.env.REACT_APP_BACKEND_URL;
            // Відправляємо файл на сервер
            const response = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Server response:", response);

            if (response.data.url) {
                const quill = quillRef.current.getEditor();
                let range = quill.getSelection();
                if (!range) {
                    console.warn("No selection found, placing cursor at the end.");
                    range = { index: quill.getLength(), length: 0 };
                }

                // Вставка медіа в редактор
                if (type === "image") {
                    quill.clipboard.dangerouslyPasteHTML(range.index, `<img src="${response.data.url}" alt="${file.name}" style="max-width: 100%; height: auto;" />`);
                } else if (type === "video") {
                    quill.clipboard.dangerouslyPasteHTML(range.index, `<video controls width="100%">
                        <source src="${response.data.url}" type="video/mp4">
                        Your browser does not support the video tag.</video>`);
                } else if (type === "document") {
                    quill.clipboard.dangerouslyPasteHTML(range.index, `<a href="${response.data.url}" target="_blank">📄 ${file.name}</a>`);
                }
                console.log("Image inserted in editor:", response.data.url);
            }
        } catch (error) {
            console.error("Error uploading media:", error);
        }
    };

    // Функція для обробки завантаження відео або документів
    const videoDocumentHandler = (type) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", type === "video" ? "video/*" : ".pdf,.docx,.txt");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                handleMediaUpload(file, type);
            }
        };
    };

    // Додаємо обробники в панель інструментів
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                [{ align: [] }],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,  // Додаємо обробник для завантаження зображень
            },
        },
    };
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
        "video",
        "align",
    ];

    return (
        <div>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
            />
        </div>
    );
};


export default TextEditor;
