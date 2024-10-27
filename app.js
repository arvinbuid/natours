const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const deepSanitize = require('./utils/deepSanitize');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// Setting up pug engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// Serving static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  statusCode: 429,
  message: 'Too many requests from this IP, please try again in 1 hour.'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use((req, res, next) => {
  deepSanitize(req.body);
  next();
});

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Other middlewares
// app.use((req, res, next) => {
//   next();
// });

// ROUTES
// Views
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Arvin'
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
});

app.use('/api/v1/tours', tourRouter); // mounting the router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', function(req, res, next) {
  next(
    new AppError(`The requested ${req.originalUrl} cannot be found😔`, '404')
  );
});

app.use(globalErrorHandler);

module.exports = app;
