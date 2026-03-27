// This example sets up an endpoint using the Express framework.
const express = require("express");
var cookieParser = require("cookie-parser");
const db = require("better-sqlite3")("quotes.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS quote (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL
    )
  `);
}
const app = express();
app.use(cookieParser());
app.use(express.json());
require("dotenv").config();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");

//  "/create-checkout-session",
app.post(
  "/create-checkout-session",
  async (req, res, next) => {
    const { customer_email, return_url } = req.body;
    req.return_url = return_url;
    next();
  },
  /** Payment service */
  async (req, res) => {
    const sessionId = req.cookies?.my_session_id;
    const my_session = sessions.get(sessionId);
    const quoteAmount = my_session.quote.amount;
    const line_items = [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Travel Insurance Policy",
          },
          unit_amount: quoteAmount * 100, //pence
        },
        quantity: 1,
      },
    ];
    const session = await stripe.checkout.sessions.create({
      line_items,
      customer_email: phoneBook.get(my_session.phoneNumber),
      mode: "payment",
      ui_mode: "custom",
      return_url: req.return_url,
    });
    // await client.set(`${}:${session.id}`, session);
    /**Store the session_id in the customer payments log */
    res.send({ clientSecret: session.client_secret });
  },
);

//  stripe return route
app.get("/session-status", async (req, res) => {
  console.log(req.query);
  const { session_id } = req.query;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  res.send({
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email,
  });
});

const sessions = new Map();

app.get("/", (req, res) => {
  const sessionId = req.cookies?.my_session_id;
  if (!sessionId || !sessions.has(sessionId)) {
    //simulate - if session doesn't exist or expired
    const sessionId = crypto.randomUUID();
    console.log("new session created", sessionId);
    const initialState = { isAuthenticated: false, phoneNumber: undefined, quote: {} };
    sessions.set(sessionId, initialState);
    res.cookie("my_session_id", sessionId, {
      path: "/",
      maxAge: 900000, // Expires in 15 minutes (in milliseconds)
      httpOnly: true, // Prevents client-side JS access (security)
    });
    res.send({ ...initialState });
  } else {
    const session = sessions.get(sessionId);
    res.send({ ...session });
  }
});

// -- protected resource --

function generateRandomQuote() {
  //if the user is authenticated
  const amount = Math.floor(Math.random() * 10000) + 901;
  const result = db.prepare("INSERT INTO quote (amount) VALUES (?)").run(amount);
  return db.prepare("SELECT * FROM quote WHERE id = ?").get(result.lastInsertRowid);
}

app.get(
  "/quote",
  (req, res, next) => {
    const sessionId = req.cookies?.my_session_id;
    const session = sessions.get(sessionId);
    if (!session?.isAuthenticated) {
      res.send(401, { status: 401, message: "Unauthorized" });
    } else {
      next();
    }
  },
  (req, res) => {
    // Save the quote to session as well
    const sessionId = req.cookies?.my_session_id;
    const session = sessions.get(sessionId);
    const quote = generateRandomQuote();
    sessions.set(sessionId, Object.assign({}, session, { quote }));
    res.send(quote);
  },
);

// ------ Auth Routes -----------
const phoneBook = new Map();
phoneBook.set("1234567890", "alice@example.com");
phoneBook.set("2345678901", "bob@example.com");
phoneBook.set("3456789012", "charlie@example.com");
phoneBook.set("4567890123", "diana@example.com");
phoneBook.set("5678901234", "eve@example.com");

const otpMap = new Map();

function generateOTP(phoneNumber) {
  const OTP = Math.floor(Math.random() * 900000) + 100000 + "";
  otpMap.set(phoneNumber, OTP);
  return OTP;
}

app.post(
  "/auth/phone",
  (req, res, next) => {
    const { phoneNumber } = req.body;
    const sessionId = req.cookies?.my_session_id;
    const session = sessions.get(sessionId); //assuming the sessionId is valid and exists
    sessions.set(sessionId, Object.assign({}, session, { phoneNumber }));
    next();
  },
  (req, res) => {
    const { phoneNumber } = req.body;
    if (phoneBook.has(phoneNumber)) {
      const otp = generateOTP(phoneNumber);
      // simulate: deliver otp
      console.log(`OTP generated for Phone: ${phoneNumber} OTP: ${otp}`);
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false, message: "Phone number is invalid" });
    }
  },
);

app.post("/auth/otp/verify", (req, res) => {
  const sessionId = req.cookies?.my_session_id;
  const session = sessions.get(sessionId);
  console.log(session);
  const { otp } = req.body;
  const phoneNumber = session.phoneNumber;
  console.log("verify ", phoneNumber, otp);
  if (otpMap.has(phoneNumber) && otpMap.get(phoneNumber) === otp) {
    console.log("otp session", sessionId);
    const session = sessions.get(sessionId);
    sessions.set(sessionId, Object.assign({}, session, { isAuthenticated: true }));

    res.send({ success: true, message: "OTP verified" });
  } else {
    res.status(400).send({ success: false, message: "Invalid phone number or OTP" });
  }
});

app.listen(4242, () => {
  initDb();
  console.log(`Listening on port ${4242}!`);
});
