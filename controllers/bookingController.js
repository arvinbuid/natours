const axios = require('axios');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');

const key = process.env.PAYMONGO_SECRET_KEY;

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('No tour found with that id.', 404));
  }

  try {
    const response = await axios.post(
      'https://api.paymongo.com/v1/sources',
      {
        data: {
          attributes: {
            type: 'gcash',
            amount: tour.price * 100,
            currency: 'PHP',
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            redirect: {
              success: `${req.protocol}://${req.get('host')}/?tour=${
                req.params.tourId
              }&user=${req.user.id}&price=${tour.price}`,
              failed: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`
            }
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(key).toString('base64')}`
        }
      }
    );

    res.status(200).json({
      status: 'success',
      session: {
        url: response.data.data.attributes.redirect.checkout_url // Redirect the user to payment
      }
    });
  } catch (err) {
    console.error(err);
    return next(
      new AppError('Failed to create PayMongo checkout session.', 400)
    );
  }
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // Temporary solution because it is NOT secured
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  // Create a new booking
  await Booking.create({ tour, user, price });

  res.redirect(`${req.protocol}://${req.get('host')}/`.split('?')[0]);
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
