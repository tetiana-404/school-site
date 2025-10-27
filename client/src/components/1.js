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
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Video, Link, FileText, Trash2 } from "lucide-react";

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
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
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
            editor.chain().focus().insertContent(`<iframe width="560" height="315" src="${formattedUrl}" frameborder="0" allowfullscreen></iframe>`).run();
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
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            const fileURL = response.data.url;
            editor.chain().focus().insertContent(`<a href="${fileURL}" target="_blank">${file.name}</a>`).run();
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.click();

        input.onchange = async () => {
            const files = Array.from(input.files);
            if (files.length > 0) await handleMultipleUploads(files);
        };
    }, []);

    const handleMultipleUploads = async (files) => {
        if (!editor) return;

        const imageBlocks = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "image");

            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
                if (response.data.url) {
                    imageBlocks.push({ type: "image", attrs: { src: response.data.url } });
                    imageBlocks.push({ type: "paragraph", content: [] });
                }
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
            }
        }
        if (imageBlocks.length > 0) {
            editor.chain().focus().insertContent(imageBlocks).run();
        }
    };

    const handleClear = () => {
        if (editor) {
            editor.chain().focus().clearContent().run();
        }
        clearEditor();
        setContent('');
    };

    return (
        <div className="container">
            <div className="editor-section">
                <h2>Вміст новини</h2>
                <div className="editor-controls">
                    <EditorButton action={() => editor.chain().focus().toggleBold().run()} icon={<Bold size={20} />} />
                    <EditorButton action={() => editor.chain().focus().toggleItalic().run()} icon={<Italic size={20} />} />
                    <EditorButton action={() => editor.chain().focus().toggleUnderline().run()} icon={<Underline size={20} />} />
                    <EditorButton action={() => editor.chain().focus().toggleBulletList().run()} icon={<List size={20} />} />
                    <EditorButton action={() => editor.chain().focus().toggleOrderedList().run()} icon={<ListOrdered size={20} />} />
                    <EditorButton action={() => editor.chain().focus().setTextAlign('left').run()} icon={<AlignLeft size={20} />} />
                    <EditorButton action={() => editor.chain().focus().setTextAlign('center').run()} icon={<AlignCenter size={20} />} />
                    <EditorButton action={() => editor.chain().focus().setTextAlign('right').run()} icon={<AlignRight size={20} />} />
                    <EditorButton action={imageHandler} icon={<Image size={20} />} />
                    <EditorButton action={() => toggleModal('video')} icon={<Video size={20} />} />
                    <EditorButton action={() => toggleModal('link')} icon={<Link size={20} />} />
                    <EditorButton action={(e) => { e.preventDefault(); document.getElementById('pdf-upload').click() }} icon={<FileText size={20} />} />
                    <input id="pdf-upload" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                    <EditorButton action={handleClear} icon={<Trash2 size={20} />} />
                </div>
                <EditorContent editor={editor} className="tiptap" />
            </div>
            <div className="output-section">
                <h2>Попередній перегляд</h2>
                <div className="output-content" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            {isModalOpen && (
                <Modal title="Введіть URL відео" onClose={() => toggleModal('video')}>
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="URL відео" />
                    <button onClick={handleInsertVideo}>Вставити відео</button>
                </Modal>
            )}
            {isModalOpenLink && (
                <Modal title="Вставити лінк" onClose={() => toggleModal('link')}>
                    <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Введіть URL" />
                    <button onClick={handleInsertLink}>Вставити</button>
                </Modal>
            )}
        </div>
    );
};

const EditorButton = ({ action, icon }) => (
    <button className="editor-button" onClick={action}>
        {icon}
    </button>
);

const Modal = ({ title, onClose, children }) => (
    <div className="modal">
        <div className="modal-content">
            <h3>{title}</h3>
            {children}
            <button onClick={onClose}>Закрити</button>
        </div>
    </div>
);

const convertYouTubeUrl = (url) => {
    const cleanUrl = url.split("&")[0];
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = cleanUrl.match(regExp);
    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return '';
};

export default TextEditor;
