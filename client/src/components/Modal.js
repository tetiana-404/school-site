import React from 'react';

const Modal = ({ title, closeModal, children }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}
        <button onClick={closeModal}>Закрити</button>
      </div>
    </div>
  );
};

export default Modal;
