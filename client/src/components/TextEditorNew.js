import React, { useState, useCallback } from "react";
import "./TextEditor.css";
import EditorToolbar from "./EditorToolbar";
import Modal from "./Modal";
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


const TextEditor = ({ content, setContent }) => {
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

    const toggleModal = (modalType) => {
        if (modalType === 'video') setIsModalOpen(!isModalOpen);
        if (modalType === 'link') setIsModalOpenLink(!isModalOpenLink);
    };

    const handleInsertVideo = () => {
        const formattedUrl = convertYouTubeUrl(videoUrl);
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
        toggleModal('video');
        setVideoUrl('');
    };

    const handleInsertLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
        toggleModal('link');
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
            const fileURL = response.data.url; // URL файлу після завантаження
            editor.chain().focus().insertContent(`<a href="${fileURL}" target="_blank">${file.name}</a>`).run();
        } catch (error) {
            console.error("Помилка завантаження файлу", error);
        }
    };

    const handleInsertImage = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.click();

        input.onchange = async () => {
            const files = Array.from(input.files); // Отримуємо всі вибрані файли
            if (files.length > 0) await handleMultipleUploads(files);
        };
    }, []);

    const handleMultipleUploads = async (files) => {
        if (!editor) return;

        console.log("Uploading files...", files);

        const imageBlocks = []; 
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
                    imageBlocks.push({
                        type: "image",
                        attrs: { src: response.data.url },
                    });

                    imageBlocks.push({
                        type: "paragraph",
                        content: [],
                    });
                } 
            } catch (error) {
                console.error(`❌ Error uploading ${file.name}:`, error);
            }
        }

        if (imageBlocks.length > 0) {
            editor.chain().focus().insertContent(imageBlocks).run();
            console.log("Image blocks inserted.");
        } else {
            console.error("❌ No valid image blocks to insert.");
        }
    };

    const handleClear = () => {
        if (editor) {
            editor.chain().focus().clearContent().run(); // Очищає Tiptap
        }
        setContent('');
    };
    
    return (
        <div className="container">
            <div className="editor-section">
                
                <EditorToolbar
                    editor={editor}
                    onInsertImage={handleInsertImage}
                    onInsertFile={handleFileUpload}
                    isModal={toggleModal}
                    isClear={handleClear}
                />
                <div className="editor-content">
                    <EditorContent editor={editor} />
                </div>
                
                <div className="table-toolbar">
                    
                    <button className="add-table-button" title="Додати таблицю" 
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
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
                <EditorToolbar
                    editor={editor}
                    onInsertImage={handleInsertImage}
                    onInsertFile={handleFileUpload}
                    isModal={toggleModal}
                    isClear={handleClear}
                />
            </div>
            
            {isModalOpen && (
                <Modal title="Введіть URL відео" closeModal={() => toggleModal('video')}>
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="URL відео" />
                    <button onClick={handleInsertVideo}>Вставити відео</button>
                </Modal>
            )}
            {isModalOpenLink && (
                <Modal title="Вставити лінк" closeModal={() => toggleModal('link')}>
                    <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Введіть URL" />
                    <button onClick={handleInsertLink}>Вставити</button>
                </Modal>
            )}
        </div>
    );
};

const convertYouTubeUrl = (url) => {
    const cleanUrl = url.split("&")[0];
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(regExp);

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url; // Якщо URL не YouTube, повертаємо як є
};

export default TextEditor;
