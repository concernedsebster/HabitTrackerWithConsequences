// src/global.d.ts
export {};

declare global {
  interface Window {
    recaptchaVerifier?: any; // or use `RecaptchaVerifier` if you're importing types from Firebase
  }
}