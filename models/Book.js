var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    isbn: {type: Number},
    library_id : { type: String },
    checked_out : { type: Boolean },
    last_check_in_dt : { type: Date },
    last_check_out_dt : { type: Date },
    checked_out_user_id : {type: String }
});

module.exports = mongoose.model('Book', bookSchema);
