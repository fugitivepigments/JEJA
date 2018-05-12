// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// GET Routes
// ====================================================================

// Display the Index page
router.get("/", function(req, res) {
	// generate a random offset
	var offset = Math.floor(Math.random() * 44800);

	// find and return 3 random works of art
	db.Artwork.findAndCountAll({
		limit: 3,
		offset: offset
	}).then((results) => {

		// Reformat results to make it easier to display data in views
		var art = [];
		for (var i = 0; i < results.rows.length; i++) {
			art.push(results.rows[i].dataValues);
		}

		console.log(art);

		// Send results to index.handlebars
		res.render("index", {artworks: art});
	}).catch((err) => {
		res.status(500).end();
	});
});

// POST Routes
// ====================================================================

// A user adds a new meme
router.post("/api/:userID/new-meme", function(req, res) {

});

// Add a new User
router.post("/api/new-user", function(req, res) {

});

// Add a new portfolio
router.post("/api/:userID/new-portfolio", function(req, res) {

});

// PUT Routes
// ====================================================================

// A user updates a Meme
router.put("/api/:userID/update-meme/:memeID", function(req, res) {

});

// A user updates a portfolio
router.put("/api/:userID/update-portfolio/:portfolioID", function(req, res) {

});

// DELETE Routes
// ====================================================================

// A user deletes a meme
router.delete("/api/:userID/delete-meme/:memeID", function(req, res) {

});

// A user deletes a portfolio
router.delete("/api/:userID/delete-portfolio/:portfolioID", function(req, res) {

});

module.exports = router;
