const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  race: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function(next) {
  // cons user = this; // document
  bcrypt.hash(this.password, 10).then(hash => {
    this.password = hash;

    next();
  });
});

userSchema.methods.verifyPassword = function(guess, callback) {
  bcrypt.compare(guess, this.password, function(err, isValid) {
    if (err) {
      return callback(err);
    }

    // here there was no error
    callback(null, isValid);
  });
};

module.exports = mongoose.model('User', userSchema, 'users');
