var User = require('../users/userModel.js'),
    Presentation  = require('./presentationModel.js'),
    Q    = require('q'),
    mongoose = require('mongoose'),
    Feedback = require('../feedback/feedbackModel'),
    Schema = mongoose.Schema;
    //jwt  = require('jwt-simple');

module.exports = {
//adds a presentation to the database
//first checks to make sure that the specific user exists
//if not it will fail
//this ensures that presentations that are not linked to anything
//are not added and clutter the database
  create: function(req, res, next){
    var title = req.body.title,
        date  = req.body.date,
        expiration = req.body.expiration,
        inDatabase = false,
        presentationid,
        _presenter = mongoose.Types.ObjectId(req.body.userid),
        findUser = Q.nbind(User.findOne, User),
        create = Q.nbind(Presentation.create, Presentation);

    findUser({_id: _presenter})
    .then(function(presenter){
      if(presenter){
        inDatabase=true;
      }
    })
    .then(function(){
      if(inDatabase){
        var newPresentation = {
            _presenter: _presenter,
            title: title, 
            date: date,
            expiration: expiration,
            criteria: ['organization','clarity','volume','posture','preparation','visual aids','connection','questions','overall',]
            };

        create(newPresentation)
        .then(function(presentation){
          presentationid = presentation.id;
        })
        .then(function(){
          return findUser({_id:_presenter})
        })
        .then(function (user) {
          if (!user) {
            next(new Error('Cannot find user'));
          } else {
            return user
          }
        })
        .then(function(founduser){
          //again, references are not two way; ObjectID's must be manually added 
          //to other docs
          founduser.presentations.push(presentationid)
          founduser.save()
          //this manually adds and preps the presentation id for json return to front end 
          newPresentation.presentationid = presentationid
          res.json({newPresentation: newPresentation })
        })
      }else{
        res.json("User not found")
      }
    })
  },

//retrieves all feedback data for a specific presentation
  onePres: function(req, res, next){
    var presentationId = mongoose.Types.ObjectId(req.params.id);
    Presentation.findOne({_id: presentationId})
                //the 'username' parameter to populate restricts
                //what data is put in place of the objectID
                //without this, the _presenter field would then
                //have everything from the doc that it references
                .populate('_presenter', 'username')
                .populate('feedbacks')
                .exec(function(err, presentations){
                  if(err) console.log(err);
                  res.json(presentations)
                })
  },
};


