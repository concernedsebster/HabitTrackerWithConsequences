import React, { useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebaseConfig.js";
import { ConfirmationResult, User } from "firebase/auth";

type PhoneAuthProps = {
  setIsAuthenticated: (value: boolean) => void;
  mode: 'login' | 'partner'
  userId: string | null
};

const PhoneAuth: React.FC<PhoneAuthProps> = ({ setIsAuthenticated, mode, userId }) => {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [confirmationResult, setConfirmationResult] = React.useState<ConfirmationResult | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  function setupRecaptcha() {
    if (!window.recaptchaVerifier) {
      // Only create reCAPTCHA if it doesn't exist
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
            console.log("✅ Recaptcha verified!", response);
          },
          "expired-callback": () => {
            console.log("❌ Recaptcha expired! Resetting...");
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
            setupRecaptcha(); // Reinialize reCAPTCHA
          },
        },
      );
    }
  }

  function handleSendCode() {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.warn("⚠️ ReCAPTCHA already cleared or not initialized", error);
      }
      window.recaptchaVerifier = null;
    }
    setupRecaptcha(); // Reinitialize reCAPTCHA before sending OTP
    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      .then((confirmation) => {
        setConfirmationResult(confirmation);
        console.log("📲 OTP sent to", phone);
      })
      .catch((error) => {
        console.error("🚨 Invalid OTP:", error);
      });
  }

  function handleVerifyCode() {
    if (mode === "partner") {
      //code
    } else (confirmationResult) {
        confirmationResult
          .confirm(code)
          .then((result) => {
            setUser(result.user);
            console.log("✅ Phone authentication successful!", result.user);
            setIsAuthenticated(true);
          })
          .catch((error) =>
            console.error("Phone aunthentication failed:", error),
          );
      }
    }
    }
    

  return (
    <div>
      <h1>Verify your Phone Number</h1>
      <>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSendCode}>Send Code</button>

        <div id="recaptcha-container"></div>

        <input
          type="text"
          placeholder="Enter the code we sent you"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleVerifyCode}>Verify Code</button>
      </>
    </div>
  );
}
export default PhoneAuth;
