var Presentation = require('../presentations/presentationModel.js'),
    Feedback  = require('./feedbackModel.js'),
    Q    = require('q');
    //jwt  = require('jwt-simple');

var presentationId;

module.exports = {

  add: function(req, res, next){
    //req.params(:feedback_id)
    presentationId = req.body.presentationId;

   // var findPresentation = Q.nbind(Presentation.onePres, Presentation), 
     var create = Q.nbind(Feedback.create, Feedback);

    var newFeedback = {
      presentationId: presentationId,
      organization: req.body.organization,
      clarity: req.body.clarity,
      volume: req.body.volume,
      posture: req.body.posture,
      prepared: req.body.prepared,
      visualAids: req.body.visualAids,
      connect: req.body.connect,
      question: req.body.question,
      overall: req.body.overall
    }

    create(newFeedback).then(function(feedback, err){
      //console.log(err);
      //console.log(feedback.id)
      res.send('Thanks for providing feedback')
    });

  },

  id: presentationId

};