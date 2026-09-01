const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passport");

const app = express();

/* ==================== SECURITY MIDDLEWARE ==================== */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],

        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "https://",
        ],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
        ],

        connectSrc: [
          "'self'",
          "https://api.open-meteo.com",
          "https://maps.google.com",
          "ws:",
          "wss:",
        ],
      },
    },

    crossOriginEmbedderPolicy: false,
  })
);

/* ==================== RATE LIMITING ==================== */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },

  skipSuccessfulRequests: false,
});

app.use("/api/", limiter);

/* ==================== AUTH LIMITER ==================== */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },

  skipSuccessfulRequests: true,
});

app.use("/api/auth/", authLimiter);

/* ==================== TICKET LIMITER ==================== */

const ticketLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message:
      "Too many tickets created, please try again later.",
  },
});

app.use("/api/tickets", ticketLimiter);

app.use("/api/support/tickets", ticketLimiter);

/* ==================== STANDARD MIDDLEWARE ==================== */

app.use(compression());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],

    exposedHeaders: [
      "Content-Range",
      "X-Content-Range",
    ],
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,

    limit: "10mb",
  })
);

app.use(morgan("combined"));

/* ==================== PASSPORT INITIALIZATION ==================== */
app.use(passport.initialize());

/* ==================== TRUST PROXY ==================== */

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/* ==================== REQUEST TIMEOUT ==================== */

app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({
      success: false,

      message: "Request timeout",
    });
  });

  res.setTimeout(30000, () => {
    res.status(408).json({
      success: false,

      message: "Response timeout",
    });
  });

  next();
});

/* ==================== REQUEST SIZE LIMIT ==================== */

app.use((req, res, next) => {
  if (
    req.headers["content-length"] >
    10 * 1024 * 1024
  ) {
    return res.status(413).json({
      success: false,

      message:
        "Request entity too large. Max size 10MB.",
    });
  }

  next();
});

/* ==================== BASIC SANITIZATION ==================== */

app.use((req, res, next) => {
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (
        typeof req.query[key] === "string"
      ) {
        req.query[key] = req.query[key]
          .replace(/[<>]/g, "")
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;")
          .replace(/\//g, "&#x2F;");
      }
    });
  }

  next();
});

/* ==================== EXPORT ==================== */

module.exports = app;