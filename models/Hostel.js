const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true },
  bedType: {
    type: String,
    enum: ['4 bedded', '3 bedded', '2 bedded', '1 bedded'],
    required: true
  },
  availableBeds: { type: Number, required: true }
});

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      'block1', 'block2', 'block3', 'block4',
      'block5', 'block6', 'block7', 'block8'
    ],
    required: true,
    unique: true
  },
  totalRooms: { type: Number, required: true },
  rooms: [roomSchema]
});

module.exports = mongoose.model('Hostel', hostelSchema); 