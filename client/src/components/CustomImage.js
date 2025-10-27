import Image from "@tiptap/extension-image";

const CustomImage = Image.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      "img",
      {
        ...HTMLAttributes,
        class: "editor-img", // 👈 додаємо клас
      },
    ];
  },
});

export default CustomImage;
