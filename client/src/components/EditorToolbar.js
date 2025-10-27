import React from 'react';
import EditorButton from './EditorButton'
import {
    Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Video, Link, FileText, Trash2,
} from "lucide-react";

const EditorToolbar = ({ editor, onInsertImage, onInsertFile, onInsertPdfLink, onInsertPdfEmbed, isModal, isClear }) => {
  const H1Icon = () => <span style={{fontWeight: 'bold'}}>H1</span>;
  const H2Icon = () => <span style={{fontWeight: 'bold'}}>H2</span>;
  const H3Icon = () => <span style={{fontWeight: 'bold'}}>H3</span>;

  return (
      <div className="editor-controls">
        <EditorButton action={() => editor.chain().focus().toggleBold().run()} icon={<Bold size={20} />} title="Жирний" />
        <EditorButton action={() => editor.chain().focus().toggleItalic().run()} icon={<Italic size={20} />} title="Курсив" />
        <EditorButton action={() => editor.chain().focus().toggleUnderline().run()} icon={<Underline size={20} />} title="Підкреслений" />
        <EditorButton action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} icon={<H1Icon size={20} />} title="Заголовок 1"/>
        <EditorButton action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} icon={<H2Icon size={20} />} title="Заголовок 2"/>
        <EditorButton action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} icon={<H3Icon size={20} />} title="Заголовок 3"/>
        <EditorButton action={() => editor.chain().focus().toggleBulletList().run()} icon={<List size={20} />} title="Ненумерований список"/>
        <EditorButton action={() => editor.chain().focus().toggleOrderedList().run()} icon={<ListOrdered size={20} />} title="Нумерований список"/>
        <EditorButton action={() => editor.chain().focus().setTextAlign('left').run()} icon={<AlignLeft size={20} />} title="Вирівняти текст зліва"/>
        <EditorButton action={() => editor.chain().focus().setTextAlign('center').run()} icon={<AlignCenter size={20} title="По центру"/>} />
        <EditorButton action={() => editor.chain().focus().setTextAlign('right').run()} icon={<AlignRight size={20} />} title="Вирівняти текст справа"/>
        <EditorButton action={(e) => { e.preventDefault(); onInsertImage(); }} icon={<Image size={20} />} title="Додати зображення"/>
        <EditorButton action={(e) => { e.preventDefault(); isModal('video') }} icon={<Video size={20} />} title="Додати відео"/>
        <EditorButton action={(e) => { e.preventDefault(); isModal('link') }} icon={<Link size={20} title="Додати посилання"/>} />
        <EditorButton action={(e) => { e.preventDefault(); document.getElementById('pdf-upload').click() }} icon={<FileText size={20} />} title="Додати pdf-файл"/>
        <input id="pdf-upload" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={onInsertPdfLink} />
        <EditorButton action={(e) => { e.preventDefault(); document.getElementById('pdf-upload-embed').click(); }} icon={<FileText size={20} />} title="📑 Додати PDF (вбудовано)" />
        <input id="pdf-upload-embed" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={onInsertPdfEmbed} />
        <EditorButton action={isClear} icon={<Trash2 size={20} />} title="Очистити"/>
      </div>
    );
  };
  
  export default EditorToolbar;