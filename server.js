// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

// Read and set environment variables
require("dotenv").config();

// Start Express app
var app = express();

// Setup Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use Static Public
app.use(express.static('public'));

// Setup Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Setup Port
var PORT = process.env.PORT || 8080;

// Route Controller
var routes = require("./controllers/meme_controller");
app.use(routes);

// Require all models
const db = require("./models");


// Sync all models
db.sequelize.sync().then(function(){
	app.listen(PORT, function() {
	  console.log("Server listening on: http://localhost:" + PORT);
	});
});
