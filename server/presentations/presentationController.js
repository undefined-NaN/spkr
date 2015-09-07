var User = require('../users/userModel.js'),
    Presentation  = require('./presentationModel.js'),
    Q    = require('q'),
    mongoose = require('mongoose'),
    Feedback = require('../feedback/feedbackModel'),
    Schema = mongoose.Schema;
    //jwt  = require('jwt-simple');


module.exports = {
  create: function(req, res, next){
    var title = req.body.title,
        date  = req.body.date,
        presentationid,
        _presenter = mongoose.Types.ObjectId(req.body.userid),
        findUser = Q.nbind(User.findOne, User),
        create = Q.nbind(Presentation.create, Presentation);

    var newPresentation = {
        _presenter: _presenter,
        title: title, 
        date: date
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
      founduser.presentations.push(presentationid)
      founduser.save()
      newPresentation.presentationid = presentationid
      res.json({newPresentation: newPresentation })
    })

  },

  onePres: function(req, res, next){
    var presentationId = mongoose.Types.ObjectId(req.params.id);
    Presentation.findOne({_id: presentationId})
                .populate('feedbacks')
                .exec(function(err, presentations){
                  if(err) console.log(err);
                  res.json(presentations)
                })
  },

  allPres: function(req, res, next){
    var userid = mongoose.Types.ObjectId(req.params.userid);
    Presentation.find({_presenter: userid})
                .populate('feedbacks')
                .then(function(user){
                  res.json(user)
                })
  }

};


