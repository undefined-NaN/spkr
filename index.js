var app = require('./server/server.js');

//set up for heroku deployment; it will search for a .env port first
//otherwise, will default to the local port 8000
var port = process.env.PORT || 8000;
 
app.listen(port);
