const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hostel: {
    type: String,
    enum: [
      'block1', 'block2', 'block3', 'block4',
      'block5', 'block6', 'block7', 'block8'
    ],
    required: true
  },
  bedType: {
    type: String,
    enum: ['4 bedded', '3 bedded', '2 bedded', '1 bedded'],
    required: true
  },
  roomNumber: { type: Number, required: true },
  phone: { type: String, unique: true, sparse: true },
  age: { type: Number },
  nationality: { type: String },
  travelPreferences: { type: [String], default: [] },
  travelStyle: { type: String },
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  idDocument: { type: String }, // file path or URL
  socialLinks: {
    google: { type: String },
    facebook: { type: String }
  }
});

module.exports = mongoose.model('Student', studentSchema); 