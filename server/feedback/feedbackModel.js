var mongoose = require('mongoose');
var presentation = require('../presentations/presentationModel.js');
var Schema = mongoose.Schema;

var FeedbackSchema = new mongoose.Schema({
    //this is the way to create doc references

  _presentation: {type: Schema.Types.ObjectId, ref: 'presentation'},

  scores: {
    type: Array,
    required: true,
  },

  comments: {
    type: String,
    required: false,
  }

});



module.exports = mongoose.model('feedback', FeedbackSchema);
