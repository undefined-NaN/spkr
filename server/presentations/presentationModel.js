var mongoose = require('mongoose');
var User = require('../users/userModel');
var Schema = mongoose.Schema;
var feedback = require('../feedback/feedbackModel');


var PresentationSchema = new mongoose.Schema({
  _presenter: {type: Schema.Types.ObjectId, ref: 'User'},
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  expiration: {
    type: Date,
    required: true
  },
  criteria: {
    type: Array,
    required: true
  },
  feedbacks: [{type: Schema.Types.ObjectId, ref: 'feedback'}]
});



module.exports = mongoose.model('presentations', PresentationSchema);
