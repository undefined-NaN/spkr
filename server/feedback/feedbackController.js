var Presentation = require('../presentations/presentationModel.js'),
    Feedback  = require('./feedbackModel.js'),
    Q    = require('q'),
    mongoose = require('mongoose');

    //jwt  = require('jwt-simple');

var presentationId;

//makes sure that a presentation exists prior to 
//adding feedback to it
//this makes sure that extraneous feedback docs are not
//added and clutter the database
module.exports = {
  add: function(req, res, next){
    var presentationId = mongoose.Types.ObjectId(req.body.presId),
        //assumes that a presentation does not exist so that 
        //we don't accidentally add when there's no need
        presentationExists = false,
        feedbackId,
        //Q makes things "thenable"
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
        // Add comments to feedback object if they exist. For feature/comments.
        if ( req.body.comments ) {
          newFeedback.comments = req.body.comments;
        }

        create(newFeedback)
        .then(function(feedback){ 
          feedbackId = feedback.id
        })
        .then(function(){
          return findPresentation({_id: presentationId})
          //returning something from a then statement allows
          //the item to be available to the next then statement
        })
        .then(function(presentation){
          //references are not two way; ObjectID's must be manually added 
          //to other docs
          presentation.feedbacks.push(feedbackId)
          //.save() must follow a model in order for the entry to enter into the database;
          presentation.save()
          res.json({data: "Thanks for providing feedback!"})
        })
      }
    })
  }
}