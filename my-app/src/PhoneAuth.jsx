import React, { useState } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../firebaseConfig";

function PhoneAuth({ setIsAuthenticated }) {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [confirmationResult, setConfirmationResult] = React.useState(null);
  const [user, setUser] = React.useState(null);

  function setupRecaptcha() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" },
      );
    }
  }

  function handleSendCode() {
    setupRecaptcha();
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
    if (confirmationResult) {
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
