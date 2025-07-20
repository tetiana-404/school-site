import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from '@tiptap/extension-heading'
import { Bold, Italic, List, Underline as UnderlineIcon, ListOrdered, AlignLeft, AlignCenter, AlignRight, X } from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

const H1Icon = () => <span style={{fontWeight: 'bold'}}>H1</span>;
const H2Icon = () => <span style={{fontWeight: 'bold'}}>H2</span>;
const H3Icon = () => <span style={{fontWeight: 'bold'}}>H3</span>;

  return (
    <div className="editor-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title="Жирний текст"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title="Курсив"
      >
        <Italic size={18} />
      </button>


      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        title="Підкреслення"
      >
        <UnderlineIcon size={18} />
      </button>
      <button
  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
  className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
  title="Заголовок 1"
>
  <H1Icon />
</button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        title="Заголовок 2"
      >
        <H2Icon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        title="Заголовок 3"
      >
        <H3Icon />
      </button>

      <button
        onClick={() => {
          console.log("CLICK bullet list");
          editor.chain().focus().toggleBulletList().run()}}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        title="Маркований список"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        title="Нумерований список"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        title="Вирівнювання по лівому краю"
      >
        <AlignLeft size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        title="Вирівнювання по центру"
      >
        <AlignCenter size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        title="Вирівнювання по правому краю"
      >
        <AlignRight size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Очистити форматування"
      >
        <X size={18} />
      </button>
    </div>
  );
};

const RichTextEditor = ({
  content,
  setContent,
  placeholder = "Введіть текст...",
  readOnly = false,
}) => {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit,
      Heading.configure({
      levels: [1, 2, 3],  
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
     
    ],
    content,
    onUpdate: ({ editor }) => {
      if (setContent) {
        setContent(editor.getHTML());
      }
    },
  });

  return (
    <div className={`rich-text-editor ${readOnly ? "read-only" : ""}`}>
      {!readOnly && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
