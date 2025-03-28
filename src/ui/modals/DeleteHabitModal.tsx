import React from "react";

type DeleteHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteHabitModal({ isOpen, onClose, onConfirm }: DeleteHabitModalProps) {
    if (!isOpen) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Delete Habit</h3>
          <p>Are you absolutely sure you want to reset your habit?</p>
          <div className="modal-buttons">
            <button onClick={onConfirm}>Yes, I'm Giving Up</button>
            <button onClick={onClose}>No, I'm Staying Locked In</button>
          </div>
        </div>
      </div>  
    );
  }

  export default DeleteHabitModal;