import React, { useState, useCallback } from "react";
import "./TextEditor.css";
import EditorToolbar from "./EditorToolbar";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Modal from "./Modal";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import Image from "@tiptap/extension-image";
import Video from '../extensions/Video';

import {
    Bold, Italic, List, ListOrdered, Link, Trash2,
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
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3], // Ваша конфігурація
                },
            }),
            ImageExtension,
            Image,
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
            TextAlign.configure({ types: ['paragraph', 'heading'] }),
            Video
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
            editor.chain().focus().setVideo({ src: formattedUrl }).run();
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
        const file = event.target.files[0];
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
            const fileURL = response.data.url;

            const icon = '📄'; 
            
            const html = `<span style="display: inline-flex; align-items: center;"> <span style="font-size: 1.4em;">
            ${icon}</span> <a href="${fileURL}" target="_blank" style="margin-left: 4px;">${file.name}</a>
        </span>`;
         
            editor.chain().focus().insertContent(html).run();
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
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (response.data.url) {
                    imageBlocks.push({
                        type: "image",
                        attrs: {
                            src: response.data.url,
                            style: "max-width: 100%; height: auto;",
                        },
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
                <div className="editor-content">
                    <EditorContent editor={editor} />
                </div>
                <div className="fixed-bottom-toolbar">
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
