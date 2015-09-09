var mongoose = require('mongoose');
var presentation = require('../presentations/presentationModel.js');
var Schema = mongoose.Schema;

var FeedbackSchema = new mongoose.Schema({
  _presentation: {type: Schema.Types.ObjectId, ref: 'presentation'},

  scores: {
    type: Array,
    required: true,
  }

});



module.exports = mongoose.model('feedback', FeedbackSchema);
