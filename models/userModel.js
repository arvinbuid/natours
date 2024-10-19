const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must have greater than or equal to 8 characters'],
    select: false // Don't show password in queries
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // Only works in CREATE and SAVE!!!
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not the same'
    }
  },
  passwordChangedAt: Date
});

// Middleware to hash passwords before saving to the database
userSchema.pre('save', async function(next) {
  // Only run this function when the password is modified
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfim field
  this.passwordConfirm = undefined;
});

// Schema instance
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // 100 < 200 // returns TRUE meaning password was changed after token is issued
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
