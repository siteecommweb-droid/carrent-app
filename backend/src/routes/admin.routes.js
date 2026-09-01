const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const adminController = require("../controllers/admin.controller");
const reservationsCtrl = require("../controllers/reservations.controller");
const ticketController = require("../controllers/ticket.controller");
const refundController = require("../controllers/refund.controller");
const emailController = require("../controllers/email.controller");
const adminCarsController = require("../controllers/adminCars.controller");
const analyticsController = require("../controllers/analytics.controller");

router.get("/", (req, res) => res.json({ success: true, admin: true }));

router.use(auth);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/revenue", adminController.getRevenueReport);
router.get("/analytics", adminController.getBookingsAnalytics);
router.get("/fleet-utilization", adminController.getFleetUtilization);
router.get("/users", adminController.listUsers);
router.put("/users/:id/role", adminController.updateUserRole);

router.get("/bookings", reservationsCtrl.listReservations);
router.get("/bookings/:id", reservationsCtrl.getReservation);
router.put("/bookings/:id", reservationsCtrl.updateReservationStatus);
router.patch("/bookings/:id", reservationsCtrl.updateReservationStatus);

router.get("/tickets", ticketController.getAllTickets);
router.get("/tickets/:id", ticketController.getTicketById);
router.post("/tickets", ticketController.createTicket);
router.patch("/tickets/:id", ticketController.updateTicketStatus);
router.post("/tickets/:id/messages", ticketController.addReply);
router.get("/tickets/:id/messages", ticketController.getTicketMessages);

router.get("/refunds", refundController.listRefunds);
router.post("/refunds", refundController.createRefundRequest);
router.patch("/refunds/:id", refundController.updateRefundStatus);

router.get("/email/inbox", emailController.getInbox);
router.post("/email/ingest", emailController.ingestEmail);
router.post("/email/parse/:id", emailController.parseEmail);
router.post("/email/create-ticket/:id", emailController.createTicketFromEmail);
router.post("/email/create-booking/:id", emailController.createBookingFromEmail);

router.get("/cars", adminCarsController.getCars);
router.get("/cars/:id", adminCarsController.getCar);
router.post("/cars", adminCarsController.createCar);
router.put("/cars/:id", adminCarsController.updateCar);
router.delete("/cars/:id", adminCarsController.deleteCar);

module.exports = router;