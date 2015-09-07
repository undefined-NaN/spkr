var mongoose = require('mongoose');
var presentation = require('../presentations/presentationModel.js');
var Schema = mongoose.Schema;

var FeedbackSchema = new mongoose.Schema({
  _presentation: {type: Schema.Types.ObjectId, ref: 'presentation'},

  organization: {
    type: Number,
    required: true,
  },
  clarity: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  posture: {
    type: Number,
    required: true,
  },
  prepared: {
    type: Number,
    required: true,
  },
  visualAids: {
    type: Number,
    required: true,
  },
  connect: {
    type: Number,
    required: true,
  },
  question: {
    type: Number,
    required: true,
  },
  overall: {
    type: Number,
    required: true,
  }

});



module.exports = mongoose.model('feedback', FeedbackSchema);
