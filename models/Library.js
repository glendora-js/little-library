var mongoose = require('mongoose');

var librarySchema = new mongoose.Schema({
  name: { type: String },
  photo_url: { type: String},
  address: { type: String, unique: true },
  coordinates: {
    type: [Number], //longitude, latitude
    index: '2d'
  },

  steward_name: { type: String},
  steward_id: { type: Number},

  email: { type: String, unique: true, lowercase: true }
});

module.exports = mongoose.model('Library', librarySchema);
