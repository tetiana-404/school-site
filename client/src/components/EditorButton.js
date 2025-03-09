import React from 'react';

const EditorButton = ({ action, icon }) => (
  <button className="editor-button" onClick={(e) =>
     {
      e.preventDefault();
      action(e)
      }}>
        {icon}
    </button>
);

export default EditorButton;
