var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware
    feedbackController = require('../feedback/feedbackController.js');


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var presentationRouter = express.Router();
  var feedbackRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/users', userRouter); // use user router for all user request
  app.use('/api/presentations', presentationRouter); //use presentation router
  app.use('/api/feedback', feedbackRouter);

  // authentication middleware used to decode token and made available on the request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
  require('../presentations/presentationRoutes.js')(presentationRouter);
  require('../feedback/feedbackRoutes.js')(feedbackRouter);
  
};
