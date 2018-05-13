// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

// Require database keys
require("dotenv").config();

// Start Express app
var app = express();

// Setup Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Setup Port
var PORT = process.env.PORT || 8080;

// Route Controllers
var meme_routes = require("./controllers/meme_controller");
var user_routes = require("./controllers/user_controller");
var portfolio_routes = require("./controllers/portfolio_controller");
app.use(meme_routes, user_routes, portfolio_routes);

// Require all models
const db = require("./models");

// Sync all models
db.sequelize.sync().then(function(){
	app.listen(PORT, function() {
	  console.log("Server listening on: http://localhost:" + PORT);
	});
});