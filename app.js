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
  res.status(404).json({
    status: 'fail',
    message: `The requested ${req.originalUrl} cannot be found😔`
  });
  next();
});

module.exports = app;
