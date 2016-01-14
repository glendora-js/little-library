var mongoose = require('mongoose');

var librarySchema = new mongoose.Schema({
  library_id : { type: String , unique: true },
  name: { type: String },
  story: { type: String },
  photo_url: { type: String },
  charter: { type: Number },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: Number },
  coordinates: {
    type: [Number], //longitude, latitude
    index: '2d'
  },
  email : { 
    type: String,
    unique: true,
    lowercase: true 
  }, 
  steward_name: { type: String },
  steward_id: { type: Number },
  status : { 
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Library', librarySchema);
