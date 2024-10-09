const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware👋');
//   next();
// });
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route handlers
const getAllTours = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours, // ES6 syntax to tours: tours
    },
  });
};

// Get single tour
const getTour = (req, res) => {
  // console.log(req.params);
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  // check if tour exists
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// Create a new tour
const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // read tours-simple file and save the newly created tour
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        message: 'New tour created',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// Update tour
const updateTour = (req, res) => {
  // check if tour exists
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>...',
    },
  });
};

// Delete tour
const deleteTour = (req, res) => {
  // check if tour exists
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
