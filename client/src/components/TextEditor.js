import React, { useRef, useMemo, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";

Quill.register("modules/better-table", QuillBetterTable);

const TextEditor = ({ content, setContent }) => {
    const quillRef = useRef(null);

    useEffect(() => {
        if (quillRef.current) {
          const toolbar = quillRef.current.getEditor().getModule("toolbar");
          toolbar.addHandler("document", pdfHandler); // Додаємо обробник кнопки
        }
      }, []);

      useEffect(() => {
        setTimeout(() => addPDFButton(), 500); // Запускаємо після завантаження редактора
      }, []);

      useEffect(() => {
        setTimeout(() => addTableButton(), 500); // Запускаємо після завантаження редактора
      }, []);
    
      const addPDFButton = () => {
        const toolbar = document.querySelector(".ql-toolbar");
        if (!toolbar) return;
    
        // Перевіряємо, чи кнопка "PDF" вже є, щоб уникнути дублювання
        if (toolbar.querySelector(".ql-document")) return;

        const videoButton = toolbar.querySelector(".ql-video"); // Знаходимо кнопку "video"
        if (!videoButton) return; // Якщо немає кнопки "video", не додаємо "PDF"
    
        const button = document.createElement("button");
        button.classList.add("ql-document"); // Додаємо клас для кнопки
        button.title = "Додати PDF"; // Підказка при наведенні
        button.onclick = pdfHandler; // Додаємо обробник кліку
        
        // 🟢 Додаємо SVG-іконку PDF
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M14 2V8H20" fill="none" stroke="currentColor" stroke-width="2"/>
                <text x="7" y="17" font-size="7" fill="currentColor">PDF</text>
            </svg>
            `;
    
        videoButton.parentNode.insertBefore(button, videoButton.nextSibling); // Додаємо після "video"
      };
    
      

      const addTableButton = () => {
        const toolbar = document.querySelector(".ql-toolbar");
        if (!toolbar) return;
    
        // Перевіряємо, чи кнопка "Таблиця" вже є, щоб уникнути дублювання
        if (toolbar.querySelector(".ql-table")) return;
    
        const pdfButton = toolbar.querySelector(".ql-document"); // Додаємо після відео
        if (!pdfButton) return; // Якщо немає "video", не додаємо
    
        const button = document.createElement("button");
        button.classList.add("ql-table"); // Клас для кнопки
        button.title = "Додати таблицю"; // Підказка
        button.onclick = tableHandler; // Додаємо обробник кліку
    
        // 🟢 Додаємо SVG-іконку таблиці
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="2"/>
                <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="2"/>
                <line x1="10" y1="4" x2="10" y2="20" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="4" x2="16" y2="20" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
    
        pdfButton.parentNode.insertBefore(button, pdfButton.nextSibling); // Додаємо після "video"
    };
    
    const tableHandler = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
    
        // HTML-код для таблиці 3x3
        const tableHtml = `
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="padding: 8px; text-align: left;">Заголовок 1</th>
                    <th style="padding: 8px; text-align: left;">Заголовок 2</th>
                    <th style="padding: 8px; text-align: left;">Заголовок 3</th>
                </tr>
                <tr>
                    <td style="padding: 8px;">Рядок 1, Колонка 1</td>
                    <td style="padding: 8px;">Рядок 1, Колонка 2</td>
                    <td style="padding: 8px;">Рядок 1, Колонка 3</td>
                </tr>
                <tr>
                    <td style="padding: 8px;">Рядок 2, Колонка 1</td>
                    <td style="padding: 8px;">Рядок 2, Колонка 2</td>
                    <td style="padding: 8px;">Рядок 2, Колонка 3</td>
                </tr>
            </table>
            <br/>
        `;
    
        quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
    };
    
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

    // Функція для обробки вставки YouTube-відео
    const videoHandler = useMemo((event) => {
        return () => {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();

            // Запитуємо у користувача посилання на відео
            const url = prompt("Вставте посилання на YouTube відео:");

            if (url) {
                // Перетворюємо URL у формат вбудованого YouTube-відео
                const embedUrl = convertYouTubeUrl(url);

                // Вставляємо <iframe> в редактор
                quill.clipboard.dangerouslyPasteHTML(range.index,
                    `<iframe width="560" height="315" src="${embedUrl}" 
                         frameborder="0" allowfullscreen style="max-width: 100%; height: auto;">
                    </iframe>`
                );
            };
        };
    }, []);

    // Функція для перетворення YouTube URL у формат <iframe>
    const convertYouTubeUrl = (url) => {
        // Шукаємо стандартні та короткі посилання YouTube
        const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts|watch\?v=)|youtu\.be\/)([^"&?/s]{11})/;
        const match = url.match(regExp);

        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url; // Якщо URL не підходить під шаблон, повертаємо його без змін
    };

    const videoHandler2 = useMemo((event) => {
        return () => {

            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "video/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                    handleMediaUpload(file, "video");
                }
            };
        };
    }, []);

    // Обробник завантаження PDF-документів
    const pdfHandler = useMemo((event) => {
        return () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "application/pdf");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                    await handleMediaUpload(file, "document");
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

            // Відправляємо файл на сервер
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, {
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

    // Додаємо обробники в панель інструментів
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"], // 🟢 Додаємо кнопку "PDF" відразу після "video"
                [{ align: [] }],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,  // Додаємо обробник для завантаження зображень
                video: videoHandler,
                document: pdfHandler,
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
