// We may not be using this at all in our code, but it may come in handy later
import React from "react";

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>{message}</p>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  export default ConfirmationModal;