require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = require("./app");

const { Server } = require("socket.io");

/* ==================== ROUTES ==================== */

const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/bookings.routes");
const carRoutes = require("./routes/cars.routes");
const ticketRoutes = require("./routes/tickets.routes");
const adminRoutes = require("./routes/admin.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const invoiceRoutes = require("./routes/invoice.routes.js");
const emailRoutes = require("./routes/email.routes");
const addonRoutes = require("./routes/addons.routes");
const couponRoutes = require("./routes/coupons.routes");
const specsRoutes = require("./routes/specs.routes");
const exchangeRoutes = require("./routes/exchange.routes");
const newsRoutes = require("./routes/news.routes");

/* ==================== PARTNERS ROUTE ==================== */
const partnersRoutes = require("./routes/partners.routes");

/* ==================== NEW ROUTES ==================== */

const uploadRoutes = require("./routes/upload.routes");
const invoicePdfRoutes = require("./routes/invoice.routes");
const refundRoutes = require("./routes/refund.routes");   // <-- ADDED
const paymentRoutes = require("./routes/payments.routes");
const otpRoutes = require("./routes/otp.routes");
const reservationsRoutes = require("./routes/reservations.routes");
const gdprRoutes = require("./routes/gdpr.routes");

/* ==================== SERVER ==================== */

const server = http.createServer(app);

/* ==================== SOCKET.IO ==================== */

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

/* ==================== STATIC FILES ==================== */

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/* ==================== API ROUTES ==================== */

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/admin/emails", emailRoutes);
app.use("/api/addons", addonRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin/specs", specsRoutes);
app.use("/api/exchange-rates", exchangeRoutes);
app.use("/api/news", newsRoutes);

/* ==================== PARTNERS API ROUTE ==================== */
app.use("/api/partners", partnersRoutes);

/* ==================== NEW API ROUTES ==================== */

app.use("/api/upload", uploadRoutes);
app.use("/api/invoice", invoicePdfRoutes);
app.use("/api/refunds", refundRoutes);   // <-- ADDED
app.use("/api/payments", paymentRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/gdpr", gdprRoutes);

/* ==================== ROOT ENDPOINT ==================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AM38 Backend Running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      bookings: "/api/bookings",
      cars: "/api/cars",
      reservations: "/api/reservations",
      tickets: "/api/tickets",
      admin: "/api/admin",
      partners: "/api/partners",
      payments: "/api/payments",
      upload: "/api/upload",
      invoice: "/api/invoice",
      otp: "/api/otp",
      refunds: "/api/refunds",   // <-- ADDED to root info
      gdpr: "/api/gdpr",
    },
    timestamp: new Date().toISOString(),
  });
});

/* ==================== HEALTH CHECK ==================== */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "AM38",
    status: "running",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

/* ==================== SOCKET.IO EVENTS ==================== */

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join room for specific booking updates
  socket.on("join-booking", (bookingId) => {
    socket.join(`booking-${bookingId}`);
    console.log(`Socket ${socket.id} joined booking-${bookingId}`);
  });

  // Join admin room for real-time admin updates
  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log(`Socket ${socket.id} joined admin room`);
  });

  // Booking created event
  socket.on("booking:created", (data) => {
    io.to("admin-room").emit("booking:update", data);
    io.to(`booking-${data.id}`).emit("booking:status", data);
  });

  // Booking status update
  socket.on("booking:status", (data) => {
    io.to("admin-room").emit("booking:refresh", data);
    io.to(`booking-${data.id}`).emit("booking:status-update", data);
  });

  // Ticket update event
  socket.on("ticket:update", (data) => {
    io.to("admin-room").emit("ticket:refresh", data);
  });

  // Payment confirmation
  socket.on("payment:confirmed", (data) => {
    io.to(`booking-${data.bookingId}`).emit("payment:success", data);
    io.to("admin-room").emit("payment:received", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

/* ==================== 404 HANDLER ==================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: [
      "/api/auth",
      "/api/bookings",
      "/api/cars",
      "/api/reservations",
      "/api/tickets",
      "/api/admin",
      "/api/partners",
      "/api/payments",
      "/api/upload",
      "/api/invoice",
      "/api/otp",
      "/api/refunds",
      "/api/health",
      "/api/gdpr",
    ],
  });
});

/* ==================== GLOBAL ERROR HANDLER ==================== */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // Handle specific error types
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large. Max size 10MB.",
    });
  }

  if (err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Allowed: images, PDFs.",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/* ==================== START SERVER ==================== */

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 AM38 Backend Server Started Successfully            ║
║                                                          ║
║   📡 Port: ${PORT}                                           ║
║   🔗 API: http://localhost:${PORT}                          ║
║   💚 Health: http://localhost:${PORT}/api/health            ║
║   🔌 Socket.IO: Active                                    ║
║                                                          ║
║   📁 Uploads: /uploads                                   ║
║   💳 Payments: /api/payments                            ║
║   📄 Invoices: /api/invoice                             ║
║   📱 OTP: /api/otp                                      ║
║   🤝 Partners: /api/partners                           ║
║   🚗 Reservations: /api/reservations                    ║
║   🔒 GDPR: /api/gdpr                                   ║
║   💰 Refunds: /api/refunds                             ║   <-- ADDED
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});