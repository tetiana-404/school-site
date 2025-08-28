import React from 'react';

const EditorButton = ({ action, icon, title  }) => (
  <button className="editor-button" onClick={(e) =>
     {
      e.preventDefault();
      action(e)
      }}
      title={title}>
        {icon}
    </button>
);

export default EditorButton;
