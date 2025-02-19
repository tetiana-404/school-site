import React, { useCallback, useMemo, useEffect } from "react";
import "./TextEditor.css";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align';
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,  Image, Video, Link, FileText, Trash2 } from "lucide-react";


const TextEditor = ({ content, setContent, clearEditor }) => {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Bold,
            Italic,
            Underline,
            List,
            ListOrdered,
            Table.configure({ resizable: true }), // Додає таблиці
            TableRow, // Додає рядки
            TableCell, // Додає комірки
            TableHeader, // Додає заголовки таблиць
            Link,
            TextAlign.configure({ types: ['paragraph', 'heading'] })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    // Функція обробника завантаження зображень
    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.setAttribute("multiple", ""); // Дозволяємо вибирати кілька файлів
        input.click();

        input.onchange = async () => {
            const files = Array.from(input.files); // Отримуємо всі вибрані файли
            if (files.length > 0) {
                await handleMultipleUploads(files); // Завантажуємо всі файли
            }
        };
    }, []);

    const insertVideo = () => {
        let videoUrl = prompt("Введіть URL відео (YouTube, Vimeo або інший)");

        videoUrl = convertYouTubeUrl(videoUrl);

        if (videoUrl) {

            editor.chain().focus().insertContent(`
            
                <iframe width="560" height="315" 
                        src="${videoUrl}" 
                        frameborder="0" 
                        allowfullscreen 
                        style="max-width: 100%; height: auto;">
                </iframe>
            
        `).run();
        }
    };

    const convertYouTubeUrl = (url) => {
        url = url.trim(); // Видаляємо зайві пробіли

        // Видаляємо додаткові параметри, якщо вони є
        const cleanUrl = url.split("&")[0];

        // ✅ Новий регекс для вилучення YouTube Video ID
        const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = cleanUrl.match(regExp);

        if (match && match[1]) {
            const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
            return embedUrl;
        }
        return url; // Якщо URL не YouTube, повертаємо як є
    };


    const insertLink = () => {
        const linkUrl = prompt("Введіть URL лінку");
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]; // Отримуємо перший (і єдиний) файл
        if (!file) return;


        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "document");

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const result = response.data;
            const fileURL = result.url; // URL файлу після завантаження

            editor.chain().focus().insertContent(`<a href="${fileURL}" target="_blank">${file.name}</a>`).run();

        } catch (error) {
            console.error("Помилка завантаження файлу", error);
        }

    };

    // Функція для завантаження кількох зображень
    const handleMultipleUploads = async (files) => {
        if (!editor) return;

        console.log("Uploading files...", files);

        const imageBlocks = []; // Масив для збереження всіх зображень

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "image");

            try {
                console.log(`Uploading file: ${file.name}`);

                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (response.data.url) {
                    const imageUrl = `${response.data.url}`;
                    console.log(`✅ Image inserted: ${imageUrl}`);

                    // Додаємо зображення в масив як ОКРЕМИЙ БЛОК (без параграфа!)
                    imageBlocks.push({
                        type: "image",
                        attrs: { src: imageUrl },
                    });

                    // Додаємо порожній абзац між зображеннями
                    imageBlocks.push({
                        type: "paragraph",
                        content: [],
                    });
                } else {
                    console.error("❌ No image URL returned from the server.");
                }
            } catch (error) {
                console.error(`❌ Error uploading ${file.name}:`, error);
            }
        }

        // Вставляємо ВСІ зображення за один раз
        if (imageBlocks.length > 0) {
            editor.chain().focus().insertContent(imageBlocks).run();
        }
    };

    // Функція для очищення вмісту редактора
    const handleClear = () => {
        if (editor) {
            editor.chain().focus().clearContent().run(); // Очищає Tiptap
        }
        clearEditor(); // Викликає функцію з Posts.js для очищення textarea
    };
    return (
        <div className="editor-container">
            <h2>My Tiptap Editor</h2>
            <div className="editor-controls">
                <button className="editor-button" onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold size={20} />
                </button>
                <button className="editor-button" onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic size={20} />
                </button>
                <button className="editor-button" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <Underline size={20} />
                </button>
                <button className="editor-button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List size={20} />
                </button>
                <button className="editor-button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered size={20} />
                </button>

                {/* Вирівнювання */}
                <button className="editor-button" onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                    <AlignLeft size={20} />
                </button>
                <button className="editor-button" onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                    <AlignCenter size={20} />
                </button>
                <button className="editor-button" onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                    <AlignRight size={20} />
                </button>


                {/* Завантаження зображення */}
               
                <button className="editor-button" onClick={(e) => { e.preventDefault(); imageHandler(); }}>
                    <Image size={20} />
                </button>
                <button className="editor-button" onClick={insertVideo}>
                    <Video size={20} />
                </button>
                <button className="editor-button" onClick={insertLink}>
                    <Link size={20} />
                </button>
                <button className="editor-button"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('pdf-upload').click()
                    }}>
                    <FileText size={20} />
                </button>
                <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <button className="editor-button" onClick={handleClear}>
                    <Trash2 size={20} />
                </button>
            </div>
            <EditorContent editor={editor} className="tiptap" />
            <div className="table-controls">
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addColumnBefore().run()}>
                    ⬅️ Додати колонку зліва
                </button>
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addColumnAfter().run()}>
                    ➡️ Додати колонку справа
                </button>
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addRowBefore().run()}>
                    ⬆️ Додати рядок зверху
                </button>
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addRowAfter().run()}>
                    ⬇️ Додати рядок знизу
                </button>
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().deleteColumn().run()}>
                    ❌ Видалити колонку
                </button>
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().deleteRow().run()}>
                    ❌ Видалити рядок
                </button>
                <button className="table-button" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().deleteTable().run()}>
                    🗑️ Видалити таблицю
                </button>
            </div>
            <button
                className="add-table-button"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
                ➕ Додати таблицю
            </button>

            <p>Output:</p>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default TextEditor;
