var Presentation = require('../presentations/presentationModel.js'),
    Feedback  = require('./feedbackModel.js'),
    Q    = require('q'),
    mongoose = require('mongoose');

    //jwt  = require('jwt-simple');

var presentationId;

module.exports = {

  add: function(req, res, next){
    var presentationId = mongoose.Types.ObjectId(req.body.presId),
        presentationExists = false,
        feedbackId,
        findPresentation = Q.nbind(Presentation.findOne, Presentation),
        create = Q.nbind(Feedback.create, Feedback);

    findPresentation({_id: presentationId})
    .then(function(presentation){
      if (presentation){
        presentationExists = true
      }
    })
    .then(function(){
      if(presentationExists){
        var newFeedback = {
          _presentation: presentationId,
          scores: [
            req.body.organization,
            req.body.clarity,
            req.body.volume,
            req.body.posture,
            req.body.prepared,
            req.body.visualAids,
            req.body.connect,
            req.body.question,
            req.body.overall
          ]
        }

        create(newFeedback)
        .then(function(feedback){ 
          feedbackId = feedback.id
        })
        .then(function(){
          return findPresentation({_id: presentationId})
        })
        .then(function(presentation){
          presentation.feedbacks.push(feedbackId)
          presentation.save()
          res.json({data: "Thanks for providing feedback!"})
        })
      }
    })
  }
}