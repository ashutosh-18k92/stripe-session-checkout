import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${import.meta.env.VITE_API_URL}/session-status?session_id=${sessionId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setStatus)
      .catch(setErr);
  }, [sessionId]);

  if (!sessionId) {
    return <p>No session ID found.</p>;
  }

  if (err) {
    return <p>Error: {String(err)}</p>;
  }

  if (!status) {
    return <p>Loading...</p>;
  }

  if (status.payment_status === "paid") {
    return (
      <div>
        <h1>Payment successful</h1>
        <p>Thank you! Your payment was received.</p>
        {status.customer_email && <p>A confirmation will be sent to {status.customer_email}.</p>}
      </div>
    );
  }

  return (
    <div>
      <h1>Payment failed</h1>
      <p>Your payment was not completed. Please try again.</p>
    </div>
  );
}
