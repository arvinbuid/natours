const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

// Route handlers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Routes
app.use('/api/v1/tours', tourRouter); // mounting the router
app.use('/api/v1/users', userRouter);

app.all('*', function(req, res, next) {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `The requested ${req.originalUrl} cannot be found😔`
  // });
  const err = new Error(`The requested ${req.originalUrl} cannot be found😔`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
