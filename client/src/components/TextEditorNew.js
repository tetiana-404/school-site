import React, { useState, useCallback } from "react";
import "./TextEditor.css";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from '@tiptap/extension-link';
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
    Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Video, Link, FileText, Trash2,
    ChevronLeft, ChevronRight, ChevronUp,
    ChevronDown, Minus, Plus
} from "lucide-react";


const TextEditor = ({ content, setContent, clearEditor }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenLink, setIsModalOpenLink] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageExtension,
            Bold,
            Italic,
            UnderlineExtension,
            List,
            ListOrdered,
            LinkExtension,
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

    // Функція для відкриття модального вікна
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Функція для закриття модального вікна
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Функція для відкриття модального вікна
    const handleOpenModalLink = () => {
        setIsModalOpenLink(true);
    };

    // Функція для закриття модального вікна
    const handleCloseModalLink = () => {
        setIsModalOpenLink(false);
    };

    // Функція для вставлення відео в редактор
    const handleInsertVideo = () => {
        let formattedUrl = videoUrl;

        // Можна додати функцію для перевірки або форматування URL, якщо потрібно
        formattedUrl = convertYouTubeUrl(formattedUrl);

        if (formattedUrl) {
            editor.chain().focus().insertContent(`
        <iframe width="560" height="315" 
                src="${formattedUrl}" 
                frameborder="0" 
                allowfullscreen 
                style="max-width: 100%; height: auto;">
        </iframe>
      `).run();
        }

        // Закрити модальне вікно після вставлення
        setIsModalOpen(false);
        setVideoUrl('');
    };

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

    const handleInsertLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
        setIsModalOpenLink(false);  // Закриття модального вікна
        setLinkUrl('');
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
            console.log("Image blocks inserted.");
        } else {
            console.error("❌ No valid image blocks to insert.");
        }
    };

    // Функція для очищення вмісту редактора
    const handleClear = () => {
        if (editor) {
            editor.chain().focus().clearContent().run(); // Очищає Tiptap
        }
        clearEditor(); // Викликає функцію з Posts.js для очищення textarea
    
        setContent('');
    };
    return (
        <div class="container">
            <div class="editor-section">
                <h2>Вміст новини</h2>
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
                    <button className="editor-button" onClick={handleOpenModal} type="button">
                        <Video size={20} />
                    </button>
                    <button className="editor-button" onClick={handleOpenModalLink} type="button">
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

                    {/* Модальне вікно */}
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Введіть URL відео</h2>
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="URL відео"
                                />
                                <button onClick={handleInsertVideo}>Вставити відео</button>
                                <button onClick={handleCloseModal}>Закрити</button>
                            </div>
                        </div>
                    )}
                    {isModalOpenLink && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Вставити лінк</h3>
                            <input
                                type="text"
                                placeholder="Введіть URL"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                            <button onClick={handleInsertLink}>Вставити</button>
                            <button onClick={handleCloseModalLink}>Закрити</button>
                        </div>
                    </div>
                    )}
                </div>
                <div className="editor-content">
                    

                    <EditorContent editor={editor} className="tiptap" />



                </div>
                
                <div className="table-toolbar">
                    
                    <button className="add-table-button" title="Додати таблицю" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true, class: 'add-table' }).run()}>
                        <Plus size={20} /> Додати таблицю
                    </button>

                    <div className="table-controls">
                        <button className="table-button" title="Додати колонку зліва" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addColumnBefore().run()}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="table-button" title="Додати колонку справа" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addColumnAfter().run()}>
                            <ChevronRight size={20} />
                        </button>
                        <button className="table-button" title="Додати рядок зверху" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addRowBefore().run()}>
                            <ChevronUp size={20} />
                        </button>
                        <button className="table-button" title="Додати рядок знизу" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().addRowAfter().run()}>
                            <ChevronDown size={20} />
                        </button>
                        <button className="table-button" title="Видалити колонку" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().deleteColumn().run()}>
                            <Minus size={20} />
                        </button>
                        <button className="table-button" title="Видалити рядок" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().deleteRow().run()}>
                            <Minus size={20} />
                        </button>
                        <button className="table-button" title="Видалити таблицю" disabled={!editor?.isActive("table")} onClick={() => editor.chain().focus().deleteTable().run()}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
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
                    <button className="editor-button" onClick={handleOpenModal} type="button">
                        <Video size={20} />
                    </button>
                    <button className="editor-button" onClick={handleOpenModalLink} type="button">
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
            </div>
            <div class="output-section">
                <h2>Попередній перегляд</h2>
                <div class="output-content" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
};

export default TextEditor;
