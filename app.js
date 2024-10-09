const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET tours
app.get('/api/v1/tours', (req, res) => {
  res.json({
    status: 'success',
    result: tours.length,
    tours, // ES6 syntax to tours: tours
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
