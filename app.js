const express = require('express');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

// Route handlers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Routes
app.use('/api/v1/tours', tourRouter); // mounting the router
app.use('/api/v1/users', userRouter);

module.exports = app;
