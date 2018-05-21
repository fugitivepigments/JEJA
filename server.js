// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var passport = require("passport");
var session = require("express-session");
require("dotenv").config();

// Start Express app
var app = express();

// Setup Body-Parser Middleware
// Increase the max request body size from 100KB to 50MB
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

// Use Static Public
app.use(express.static('public'));

// Setup Handlebars
app.engine("handlebars", exphbs({
	defaultLayout: "main",
	helpers: {
	    section: function(name, options){
	        if(!this._sections) this._sections = {};
	        this._sections[name] = options.fn(this);
	        return null;
	    }
	}
}));
app.set("view engine", "handlebars");

// Setup Passport
app.use(session({
    secret: 'indigo paper',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// Require all models
const db = require("./models");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
var authRoute = require('./routes/auth.js')(app, passport);

var meme_routes = require("./controllers/meme_controller");
// var user_routes = require("./controllers/user_controller");
var portfolio_routes = require("./controllers/portfolio_controller");

app.use(meme_routes, portfolio_routes);



//load passport strategies
require('./config/passport/passport.js')(passport, db.User);


// Setup Port
var PORT = process.env.PORT || 5000;

// Sync all models & only listen once we are connected to the database
db.sequelize.sync().then(function(){
	app.listen(PORT, function(err) {
		if(!err){
	  		console.log("Server listening on: http://localhost:" + PORT);
		} else {
			console.log(err);
		}
	});
}).catch(function(err) {
    console.log(err, "Something is wrong with the Database!")
});
