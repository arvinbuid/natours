const express = require('express');
const morgan = require('morgan');

const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});

console.log(process.env.NODE_ENV);

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
