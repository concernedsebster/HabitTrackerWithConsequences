import React, { useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebaseConfig.js";
import { ConfirmationResult, User } from "firebase/auth";
import { doc, updateDoc, serverTimestamp, getFirestore } from "firebase/firestore";

type PhoneAuthProps = {
  setIsAuthenticated: (value: boolean) => void;
  mode: 'login' | 'partner'
  userId: string | null
};

const PhoneAuth: React.FC<PhoneAuthProps> = ({ setIsAuthenticated, mode, userId }) => {
  const [phone, setPhone] = React.useState("");
  const [partnerPhoneInput, setPartnerPhoneInput] = useState("");
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

  async function handleVerifyCode() {
    if (!confirmationResult) return;
    try {
      const result = await confirmationResult.confirm(code);
      const verifiedUser = result.user;
      setUser(verifiedUser);

      if (mode === "partner" && userId) {
        const firestore = getFirestore();
        const userDocRef = doc(firestore, "users", userId);
        await updateDoc(userDocRef, {
          accountability: {
            partnerPhone: partnerPhoneInput,
            partnerIsVerified: true,
            partnerVerifiedAt: serverTimestamp()
          }
        });
        console.log("✅ Partner verification saved to Firestore");
      }
      setIsAuthenticated(true);
      console.log("✅ Phone authentication successful!", verifiedUser);
    } catch (error) {
      console.error("Phone authentication failed:", error);
    }
  }

  return (
    <div>
      <h1>Verify your Phone Number</h1>
      <>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={mode === "login" ? phone : partnerPhoneInput}
          onChange={(e) => {
            const val = e.target.value;
            mode === "login" ? setPhone(val) : setPartnerPhoneInput(val);
          }}
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
