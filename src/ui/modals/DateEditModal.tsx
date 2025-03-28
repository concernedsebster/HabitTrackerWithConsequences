import React from "react";

type DateEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DateEditModal({ isOpen, onClose, onConfirm }: DateEditModalProps) {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>One-time Date Change</h3>
          <p>Are you absolutely sure you want to change your commitment date? You can only do this ONCE.</p>
          <div className="modal-buttons">
            <button onClick={onConfirm}>Yes, change it</button>
            <button onClick={onClose}>No, keep it</button>
          </div>
        </div>
      </div>  
    );
  }
  export default DateEditModal;