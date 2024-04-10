const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
//   address: {
//     type: String,
//     required: true
//   },
  landmark: {
    type: String,
    required: true
  },
  
  phoneNumber: {
    type: String,
    required: true
  },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  hobbies: {
    type: [String],
    default: []
  },
  image: {
    type: String
  },
  // password: {
  //   type: String,
  //   required: true
  // },
  // otp: {
  //   code: String,
  //   expiresAt: Date
  // },
  // lastOTPSentAt: Date

});
const User = mongoose.model('newdata', userSchema);
module.exports = User;
