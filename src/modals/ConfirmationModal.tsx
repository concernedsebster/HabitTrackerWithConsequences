import React from "react";

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}
 
 function ConfirmationModal({ isOpen, onClose, onConfirm, message }: ConfirmationModalProps) {
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