const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  statusCode: 429,
  message: 'Too many requests from this IP, please try again in 1 hour.'
});

app.use('/api', limiter);

// Route handlers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Routes
app.use('/api/v1/tours', tourRouter); // mounting the router
app.use('/api/v1/users', userRouter);
app.all('*', function(req, res, next) {
  next(
    new AppError(`The requested ${req.originalUrl} cannot be found😔`, '404')
  );
});

app.use(globalErrorHandler);

module.exports = app;
