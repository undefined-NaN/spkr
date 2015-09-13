var db = require('mocha-mongodb');
var expect = require('chai').expect;
var request = require('request');


db.connect('mongodb://localhost/spkr');
db.remove('users', {username: 'Svnh'});
db.remove('presentations', {title: 'How to write a test'});
db.remove('feedbacks', {scores: [ 999, 999, 999, 999, 999, 999, 999, 999, 999 ]});


describe("User controller:", function(){  
  it("Signup returns a token and a userid", function(done){ 
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
      }
    };

    request(options, function(error, res, body){
      expect(body).to.have.property("token")
      expect(body).to.have.property("userid")
      done()
    }) 
  });

  it("User cannot sign up with username that already exists", function(done){
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
        }
    }
    request(options, function(err, res, body){
      request(options, function(err,res, body){
      expect(body.error).to.equal("User already exists!")
      done();
      })
    })
  })

  it("Allows registered users to sign in", function(done){
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
        }
    }
    request(options, function(err, res, body){
      options.uri = 'http://127.0.0.1:8000/api/users/login'
      request(options, function(err, res, body){
        expect(body).to.have.property("token")
        expect(body).to.have.property("userid")
        done()
      })
    })
  })

  it("Login fails for unregistered users", function(done){
    var options = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/users/login',
      'json': {
        'username': 'Dope',
        'password': 'Dope'
        }
    }
    request(options, function(err, res, body){
      expect(body.error).to.equal("User does not exist");
      done();
    })
  })

  it("Returns all presentation data for a user on request", function(done){
    var userOptions = {
    'method': 'POST',
    'uri': 'http://127.0.0.1:8000/api/users/signup',
    'json': {
      'username': 'Svnh',
      'password': 'Svnh'
      }
    };

    request(userOptions, function(err, res, body){
      var userid = body.userid;
      var presenterOptions = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:8000/api/presentations/',
        'json': {
          "title": 'How to write a test',
          "date" : '12/1/86',
          "userid": userid,
          "expiration": '12/2/86'
        }
      };

      request(presenterOptions, function(err, res, body){
        var presentationId = body.newPresentation.presentationid;
        var feedbackObj = {
          'method': 'POST',
          'uri': 'http://127.0.0.1:8000/api/feedback',
          'json': {
            'presId': presentationId,
            "organization":999,
            "clarity": 999,
            "volume": 999,
            "posture": 999,
            "prepared": 999,
            "visualAids": 999,
            "connect": 999,
            "question": 999,
            "overall": 999
          }
        };

        request(feedbackObj, function(err, res, body){

        userOptions.method = "GET";
        userOptions.uri = 'http://127.0.0.1:8000/api/users/' + userid;
            request(userOptions, function(err, res, body){
              expect(body[1]._presenter).to.equal(userid);
              expect(body[1]).to.have.property('title');
              expect(body[1]).to.have.property('date');
              expect(body[1]._id).to.equal(presentationId)
              expect(body[1].feedbacks[0]._presentation).to.equal(body[1]._id)
              done();
            })

          
        })
      })
    })
  })
})

describe("Presenter controller:", function(){
  it("Returns error message if a presentation is attempted for a user that does not exist", function(done){
      var presenterOptions = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:8000/api/presentations/',
        'json': {
          "title": 'How to write a test',
          "date" : '12/1/86',
          "userid": 1234567890,
          "expiration": '12/2/86'
        }
      }

      request(presenterOptions, function(err, res, body){
          expect(body).to.equal("User not found");
          done();

      })
  });

  it("Adds a presentation to a user's presentations on creation", function(done){
    var userOptions = {
    'method': 'POST',
    'uri': 'http://127.0.0.1:8000/api/users/signup',
    'json': {
      'username': 'Svnh',
      'password': 'Svnh'
      }
    };
      request(userOptions, function(err, res, body){
        var userid = body.userid;
        var presenterOptions = {
          'method': 'POST',
          'uri': 'http://127.0.0.1:8000/api/presentations/',
          'json': {
            "title": 'How to write a test',
            "date" : '12/1/86',
            "userid": userid,
            "expiration": '12/2/86'
          }
        };
        request(presenterOptions, function(err, res, body){
            var presId = body.newPresentation.presentationid;
            userOptions.method = 'GET'
            userOptions.uri = 'http://127.0.0.1:8000/api/users/' + userid
            request(userOptions, function(err, res, body){
              expect(body[1]._id).to.equal(presId)
              done()
            })
        })
    })
  });

  it("Returns a presentation id on a successfully created presentation", function(done){
    var userOptions = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
        }
    };

      request(userOptions, function(err, res, body){
        var userid = body.userid;
        var presenterOptions = {
          'method': 'POST',
          'uri': 'http://127.0.0.1:8000/api/presentations/',
          'json': {
            "title": 'How to write a test',
            "date" : '12/1/86',
            "userid": userid,
            "expiration": '12/2/86'
          }
        };
        request(presenterOptions, function(err, res, body){
            expect(body.newPresentation).to.have.property("presentationid");
            done();
        })
    })
  })

  it("Sends back correct data and a feedback array for a requested presentation", function(done){
    var userOptions = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/users/signup',
      'json': {
        'username': 'Svnh',
        'password': 'Svnh'
        }
    };

      request(userOptions, function(err, res, body){
        var userid = body.userid;
        var presenterOptions = {
          'method': 'POST',
          'uri': 'http://127.0.0.1:8000/api/presentations/',
          'json': {
            "title": 'How to write a test',
            "date" : '12/1/86',
            "userid": userid,
            "expiration": '12/2/86'
          }
        };
        request(presenterOptions, function(err, res, body){
          var presentationId = body.newPresentation.presentationid;
          var presentationObj = {
            'method': 'GET',
            'uri': 'http://127.0.0.1:8000/api/presentations/' + presentationId,
          }
          request(presentationObj, function(err, res, body){
            var parsedRes = JSON.parse(body);
            expect(parsedRes._id).to.equal(presentationId);
            expect(parsedRes).to.have.property("feedbacks");
            expect(parsedRes).to.have.property("title");
            expect(parsedRes).to.have.property("date");
            expect(parsedRes._presenter).to.have.property("username");
            done()
          })
        })
      })
  })
}); 

describe("Feedback controller:", function(){

  it("Adds new feedback to an existing presentation", function(done){
    var userOptions = {
    'method': 'POST',
    'uri': 'http://127.0.0.1:8000/api/users/signup',
    'json': {
      'username': 'Svnh',
      'password': 'Svnh'
      }
    };

    request(userOptions, function(err, res, body){
      var userid = body.userid;
      var presenterOptions = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:8000/api/presentations/',
        'json': {
          "title": 'How to write a test',
          "date" : '12/1/86',
          "userid": userid,
          "expiration": '12/2/86'
        }
      };
      request(presenterOptions, function(err, res, body){
        var presentationId = body.newPresentation.presentationid;
        var feedbackObj = {
          'method': 'POST',
          'uri': 'http://127.0.0.1:8000/api/feedback',
          'json': {
            'presId': presentationId,
            "organization":999,
            "clarity": 999,
            "volume": 999,
            "posture": 999,
            "prepared": 999,
            "visualAids": 999,
            "connect": 999,
            "question": 999,
            "overall": 999
          }
        };

          request(feedbackObj, function(err, res, body){
            expect(body.data).to.equal("Thanks for providing feedback!")
            presenterOptions.uri = 'http://127.0.0.1:8000/api/presentations/' + presentationId;
            presenterOptions.method = 'GET';

            request(presenterOptions, function(err, res, body){
              expect(body.feedbacks[0]._presentation).to.equal(presentationId)
              expect(body.feedbacks[0]).to.have.property('scores')
              done();
            })
         })
      })
    })
  })

  it("Fails when trying to add to a nonexistent presentation", function(done){
    var feedbackObj = {
      'method': 'POST',
      'uri': 'http://127.0.0.1:8000/api/feedback',
      'json': {
        'presId': 'p123456789',
        "organization":999,
        "clarity": 999,
        "volume": 999,
        "posture": 999,
        "prepared": 999,
        "visualAids": 999,
        "connect": 999,
        "question": 999,
        "overall": 999
      }
    };

   request(feedbackObj, function(err, res, body){
    expect(body).to.have.property("error");
    done();
   })
  })
})





