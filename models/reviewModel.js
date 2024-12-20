// review, rating, createdAt, ref to tour, ref to user
const mongoose = require('mongoose');
const Tour = require('./../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating must be between 1 and 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Unique Compound Index for tour and user field to avoid duplicate tour reviews from the same user.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// MIDDLEWARES
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nReviews: { $sum: 1 },
        rating: { $avg: '$rating' }
      }
    }
  ]);

  // console.log(stats);

  // Save statistics to current tour
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nReviews,
      ratingsAverage: stats[0].rating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// Middleware to execute tourSchema static method calcAverageRatings()
reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.review = await this.findOne();
  next();
});

// Middleware to execute tourSchema static method calcAverageRatings() when updating and deleting a review
reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne() does NOT work here, query has already executed
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

// Model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
