# Stripe Session Checkout

A full-stack payment flow built with React (Vite) and Express, using Stripe's embedded checkout with phone-based OTP authentication.

---

## How it works

1. User enters a phone number and receives a one-time passcode (OTP)
2. After OTP verification, the user can request a quote
3. The user proceeds to pay — Stripe's embedded `CheckoutForm` is rendered
4. On completion, Stripe redirects to `/checkout/return` which shows a success or failure page

---

## Project structure

```
stripe-session-checkout/
├── server.js               # Express backend
└── vite-payments/          # React frontend
    └── src/
        ├── main.jsx                    # Router setup
        ├── App.jsx                     # Root: auth + quote + checkout orchestration
        ├── CheckoutForm.jsx            # Stripe PaymentElement form
        ├── PayButton.jsx               # Stripe confirm button
        ├── components/
        │   ├── PhoneAuth.jsx           # Phone + OTP auth form
        │   └── QuotePanel.jsx          # Quote display and pricing
        └── checkout/
            └── Checkout.jsx            # Return page after Stripe redirect
```

---

## Setup

### Prerequisites

- Node.js
- pnpm
- A Stripe account with test keys

### Environment variables

**`vite-payments/.env`**
```
VITE_STRIPE_PK=pk_test_...
VITE_API_URL=http://localhost:4242
```

**`.env`** (root, for the server)
```
STRIPE_SECRET_KEY=sk_test_...
```

### Install and run

```bash
# Backend
npm install
node server.js

# Frontend (in a separate terminal)
cd vite-payments
pnpm install
pnpm dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:4242`.

---

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Initialises a session cookie |
| POST | `/auth/phone` | Sends OTP for a phone number |
| POST | `/auth/otp/verify` | Verifies the OTP and authenticates the session |
| GET | `/quote` | Returns a random quote (requires auth) |
| POST | `/create-checkout-session` | Creates a Stripe checkout session and returns `clientSecret` |
| GET | `/checkout/return` | Retrieves session status from Stripe for the return page |

---

## Frontend routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `App` | Main flow: auth → quote → payment |
| `/checkout/return` | `CheckoutReturn` | Post-payment result page |
| `/about` | `About` | About page |

---

## Test phone numbers

The following phone numbers are accepted by the server:

| Phone | Email |
|-------|-------|
| 1234567890 | alice@example.com |
| 2345678901 | bob@example.com |
| 3456789012 | charlie@example.com |
| 4567890123 | diana@example.com |
| 5678901234 | eve@example.com |

The OTP is printed to the server console on each request.
