var presentationController = require('./presentationController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/', presentationController.create); //create a presentation and send back unique id
  app.get('/:id', presentationController.onePres);
  app.get('/all', presentationController.allPres);
}; 
