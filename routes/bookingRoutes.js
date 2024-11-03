const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.createCheckoutSession
);

// Protect the routes and restrict to ONLY admin and lead-guide
router.use(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide')
);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
