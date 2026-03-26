export default function QuotePanel({ quote, auth, clientSecret, onQuoteUpdate, onProceedToPay, onError }) {
  async function seePricingHandler() {
    await fetch(`${import.meta.env.VITE_API_URL}/quote`, { credentials: "include" })
      .then((res) => res.json())
      .then(onQuoteUpdate)
      .catch(onError);
  }

  return (
    <div>
      <h1>Quote</h1>
      <p>quote ref: {quote.id}</p>
      <p>
        Amount:{" "}
        <span style={{ fontSize: "24px", fontFamily: "Serif" }}>&#163; {quote.amount}</span>
      </p>
      {!quote.id ? (
        <button disabled={!auth} onClick={seePricingHandler}>
          See Pricing
        </button>
      ) : (
        !clientSecret && (
          <button onClick={onProceedToPay}>Proceed to pay</button>
        )
      )}
    </div>
  );
}
