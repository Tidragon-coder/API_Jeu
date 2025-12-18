const mongoose = require('mongoose');
const genreSchema = new mongoose.Schema({
  name: { 
        type: String,
        required: true
    },
  description: {
        type: String,
        required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Genre', genreSchema);

/**
 * JSON genre 
 * @example
 * {
 *   "name": "Action"
 *   "description": "Genre de films d'action"
 * }
*/
