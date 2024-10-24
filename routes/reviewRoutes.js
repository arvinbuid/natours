const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(authController.protect, reviewController.updateReview)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    reviewController.deleteReview
  );

module.exports = router;
