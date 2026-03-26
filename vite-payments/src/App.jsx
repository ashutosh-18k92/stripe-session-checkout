import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useEffect, useState } from "react";
import { CheckoutForm } from "./CheckoutForm";
import PhoneAuth from "./components/PhoneAuth";
import QuotePanel from "./components/QuotePanel";
import "./App.css";

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

function App() {
  const [clientSecret, setClientSecret] = useState(null);
  const [quote, setQuote] = useState({ id: null, amount: null });
  const [auth, setAuth] = useState(false);
  const [pay, setPay] = useState(false);
  const [err, setErr] = useState(null);

  /** initialize the session on page load */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}`, { credentials: "include" });
  }, []);

  useEffect(() => {
    if (!auth || !pay) return;
    fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_email: "ashutosh.18k92@outlook.com",
        quoteId: quote.id,
        return_url: "http://localhost:5173/checkout/return?session_id={CHECKOUT_SESSION_ID}",
      }),
    })
      .then((res) => res.json())
      .then((json) => setClientSecret(json.clientSecret))
      .catch(setErr);
  }, [auth, pay]);

  return (
    <>
      {err && <p>Error: {err}</p>}
      {!auth && <PhoneAuth onAuth={() => setAuth(true)} onError={setErr} />}
      {auth && (
        <QuotePanel
          quote={quote}
          auth={auth}
          clientSecret={clientSecret}
          onQuoteUpdate={setQuote}
          onProceedToPay={() => setPay(true)}
          onError={setErr}
        />
      )}
      {auth && clientSecret && (
        <CheckoutProvider stripe={stripe} options={{ clientSecret }}>
          <CheckoutForm />
        </CheckoutProvider>
      )}
    </>
  );
}

export default App;
