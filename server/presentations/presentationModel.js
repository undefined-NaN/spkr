var mongoose = require('mongoose');
var User = require('../users/userModel');
var Schema = mongoose.Schema;
var feedback = require('../feedback/feedbackModel');


var PresentationSchema = new mongoose.Schema({
  //this is the way to create doc references
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
  //the feedbacks array will be an array of integers;
  //criteria have been separated to eliminate repetition
  //ie: {organization:100, volume: 100, ...}
  //every time
  //criteria now exists as a separate property

  feedbacks: [{type: Schema.Types.ObjectId, ref: 'feedback'}]
});



module.exports = mongoose.model('presentations', PresentationSchema);
