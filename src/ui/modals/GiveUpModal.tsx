import React from "react";

type GiveUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasUsedFreeFailure: boolean;
  giveUpCount: number;
  hasPaymentMethod: boolean;
}

function GiveUpModal({ 
  hasUsedFreeFailure, 
  isOpen, 
  onClose, 
  onConfirm,
  giveUpCount,
  hasPaymentMethod,
   }: GiveUpModalProps) {
    if (!isOpen) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>😥Giving up already?😥</h3>
          {giveUpCount >= 2 ? (
            hasPaymentMethod ? (
              <>
                <p>You've used your two free resets. We'll charge $5 if you give up again.</p>
                <p>Are you sure you want to continue?</p>
                <p>Free resets remaining: 0</p>
                <div className="modal-buttons">
                  <button onClick={onConfirm}>Yes, I'm Giving Up</button>
                  <button onClick={onClose}>No, I'm Staying Locked In</button>
                </div>
              </>
            ) : (
              <>
                <p>You’ve used your two free resets. To try again, you’ll need to add a payment method.</p>
                <p>We’ll only charge you if you give up next time.</p>
                <p>Free resets remaining: 0</p>
                <div className="modal-buttons">
                  <button onClick={onConfirm}>Add Payment Method</button>
                  <button onClick={onClose}>No, I'm Staying Locked In</button>
                </div>
              </>
            )
          ) : !hasUsedFreeFailure ? (
            <>
              <p>We'll count this as a failure - you only get one free failure, ever! Are you absolutely sure you want to reset your habit?</p>
              <p>Free resets remaining: {1 - giveUpCount}</p>
              <div className="modal-buttons">
                <button onClick={onConfirm}>Yes, I'm Giving Up</button>
                <button onClick={onClose}>No, I'm Staying Locked In</button>
              </div>
            </>
          ) : (
            <>
              <p>This counts as a failure, and you've already used your one freebie.</p>
              <p>Next time, you’ll need to pay $5 to give up. Are you sure you want to try again?</p>
              <p>Free resets remaining: {1 - giveUpCount}</p>
              <div className="modal-buttons">
                <button onClick={onConfirm}>Yes, I'm Giving Up</button>
                <button onClick={onClose}>No, I'm Staying Locked In</button>
              </div>
            </>
          )}
        </div>
      </div>  
    );
  }

  export default GiveUpModal;

  // Stripe logic coming soon to handle cases where the user has not set up payment, and where the user has set up payment
  // and we need to charge them. Need to investigate the cleanest flow for this given Apple's payment policies. 