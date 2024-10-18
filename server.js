const mongoose = require('mongoose');
const dotenv = require('dotenv');
const process = require('process');

// Handling errors occured in synchronous codes
process.on('uncaughtException', err => {
  const filteredStack = err.stack
    .split('\n')
    .filter(frame => !frame.includes('node:internal'))
    .join('\n');
  console.log(filteredStack);
  console.log('UNCAUGHT EXCEPTION, Shutting down...💥');
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// DB connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connection successful.');
  });

// Port
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

// Handling errors occured in asynchronous codes
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, Shutting down...💥');
  server.close(() => {
    process.exit(1);
  });
});
