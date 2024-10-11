const Tour = require('./../models/tourModel');

// Route handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success'
    // result: tours.length,
    // requestedAt: req.requestTime,
    // data: {
    //   tours // ES6 syntax to tours: tours
    // }
  });
};

exports.getTour = (req, res) => {
  // const id = +req.params.id;
  // const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success'
    // data: {
    //   tour
    // }
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      message: 'New tour created successfully',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>...'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

////////////////////////////////
//// FOR FUTURE REFERENCES

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// Middlewares
// exports.checkID = (req, res, next, val) => {
//   // console.log(`The id is: ${val}`);

//   if (+req.params.id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// }
