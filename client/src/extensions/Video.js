import { Node, mergeAttributes } from "@tiptap/core";

const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: '560' },
      height: { default: '315' },
      frameborder: { default: '0' },
      allowfullscreen: { default: true },
      style: { default: 'max-width: 100%; height: auto; display:block; margin: 0 auto;' },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
  "div",
  { style: "position: relative; width: 100%; padding-bottom: 56.25%;" }, // 16:9 = 9/16 = 0.5625
  [
    "iframe",
    mergeAttributes(HTMLAttributes, {
      src: HTMLAttributes.src,
      style: "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;",
      allowfullscreen: "true",
    }),
  ],
];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default Video;
