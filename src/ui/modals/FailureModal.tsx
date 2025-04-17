import React from "react";

type failureModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    hasFailedBefore: boolean;
}

function failureModal({ isOpen, onClose, onConfirm, hasFailedBefore}: failureModalProps) {
    if (!isOpen) return null;
    return  (
        <div className="failure-modal-overlay">
            <div className="failure-modal-content">
                <h3>Confirm Failure</h3>
                {hasFailedBefore ? <p>You've used up your one free failure. Now you need to pay the consequence.</p> : <p>This is your one and only chance at declaring failure without consequences. Are you sure?</p>}
                <div className="failure-modal-buttons">
                    <button onClick={onConfirm}>💀Declare Failure💀</button>
                    <button onClick={onClose}>Nevermind</button>
                </div>
            </div>
        </div>
    )
}

export default failureModal;