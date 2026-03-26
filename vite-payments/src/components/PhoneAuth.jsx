import { useState } from "react";

export default function PhoneAuth({ onAuth, onError }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpDispatch, setOtpDispatch] = useState(false);

  function requestOTP() {
    fetch(`${import.meta.env.VITE_API_URL}/auth/phone`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone }),
    })
      .then((res) => res.json())
      .then((res) => (res.success ? setOtpDispatch(true) : onError(res.message)))
      .catch(onError);
  }

  function otpVerificationHandler() {
    fetch(`${import.meta.env.VITE_API_URL}/auth/otp/verify`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    })
      .then((res) => res.json())
      .then((json) => (json.success ? onAuth() : onError(json.message)))
      .catch(onError);
  }

  return (
    <div>
      <h1>Vite Payments</h1>
      <input
        type="tel"
        placeholder="Enter 10 digit phone number"
        pattern="[0-9]{10}"
        maxLength="10"
        minLength="10"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
      />
      <button onClick={requestOTP} disabled={phone.length !== 10}>
        Get OTP
      </button>
      {otpDispatch && (
        <>
          <input
            type="tel"
            placeholder="Enter 6 digit OTP"
            pattern="[0-9]{6}"
            maxLength="6"
            minLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button onClick={otpVerificationHandler} disabled={otp.length !== 6}>
            Verify
          </button>
        </>
      )}
    </div>
  );
}
