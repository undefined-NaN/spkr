var userController = require('./userController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/create', presentationsController.create); //create a presentation and send back unique id
  app.get('/presentation/:id', presentationsController.onePres);
}; 
