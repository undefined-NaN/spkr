var mongoose = require('mongoose');
var User = require('../users/userModel');
var Schema = mongoose.Schema;


var PresentationSchema = new mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  scores:{
    type: Array,
    required: true
  }

});



module.exports = mongoose.model('presentations', PresentationSchema);
