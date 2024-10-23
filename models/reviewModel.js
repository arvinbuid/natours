// review, rating, createdAt, ref to tour, ref to user
const mongoose = require('mongoose');

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

// MIDDLEWARES
reviewSchema.pre(/^find/, function(next) {
  this.populate([
    {
      path: 'tour',
      select:
        '-guides -_id -durationWeeks -startLocation -ratingsQuantity -images -startDates -secretTour -duration -maxGroupSize -difficulty -price -description -imageCover -locations -slug -__v -durationWeeks -id'
    },
    {
      path: 'user',
      select: 'name photo'
    }
  ]);

  next();
});

// Model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
