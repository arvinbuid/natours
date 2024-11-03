const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.post(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.createCheckoutSession
);

module.exports = router;
