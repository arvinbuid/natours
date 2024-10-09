const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// middleware
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Get All Tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours, // ES6 syntax to tours: tours
    },
  });
});

// Get Single Tour
app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(req.params);
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  // check if tour exists
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour cannot be found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Create New Tour
app.post('/api/v1/tours', (req, res) => {
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
          tours: newTour,
        },
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
