var mongoose = require('mongoose'),



var PresentationSchema = new mongoose.Schema({
  // associatedUser: {
  //   type: String,
  //   required: true
  // }

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
  },

});



module.exports = mongoose.model('presentations', PresentationSchema);
