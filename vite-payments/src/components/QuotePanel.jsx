export default function QuotePanel({
  quote,
  auth,
  clientSecret,
  onQuoteUpdate,
  onProceedToPay,
  onError,
}) {
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
        Amount: <span style={{ fontSize: "24px", fontFamily: "Serif" }}>&#163; {quote.amount}</span>
      </p>
      <button
        disabled={!auth}
        onClick={seePricingHandler}
      >
        {!quote.id ? "See Pricing" : "Refresh"}
      </button>

      {!clientSecret && quote.id && <button onClick={onProceedToPay}>Proceed to pay</button>}
    </div>
  );
}
