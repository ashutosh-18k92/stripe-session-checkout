import React from "react";
import { useCheckout, PaymentElement } from "@stripe/react-stripe-js/checkout";
import PayButton from "./PayButton";

export const CheckoutForm = () => {
  const checkoutState = useCheckout();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(null);

  if (checkoutState.type === "loading") {
    return <div>Loading...</div>;
  }

  if (checkoutState.type === "error") {
    return <div>Error: {checkoutState.error.message}</div>;
  }

  return (
    <form>
      {/* {JSON.stringify(checkoutState.checkout.lineItems, null, 2)} */}
      {/* A formatted total amount */}
      Total: {checkoutState.checkout.total.total.amount}
      <PaymentElement options={{ layout: "accordion" }} />
      <PayButton />
    </form>
  );
};
