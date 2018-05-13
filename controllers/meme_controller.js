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

// Displays the Meme Editor page
router.get("/meme-editor/:memeID", function(req, res) {
	db.Meme.findById(req.params.memeID).then((results) => {
		// TODO: Need to update 
		console.log(results);
		res.render("editor", {artworks: art});
	}).catch((err) => {
		res.status(500).end();
	});
});

// POST Routes
// ====================================================================

// A user adds a new meme (without a Portfolio)
router.post("/api/:userID/new-meme", function(req, res) {
	var meme = req.body;
	db.Meme.create({
		meme_name: meme.meme_name,
		meme_text: meme.meme_text,
		og_img: meme.og_img,
		new_img: meme.new_img,
		tags: meme.tags,
		UserId: req.params.userID
	}).then(() => {
		console.log('Successfully added meme: ' + req.body.meme_name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while adding meme: ' + req.body.meme_name).end();
	});	
});

// A user adds a new meme (with a Portfolio)
router.post("/api/:userID/:portfolioID/new-meme", function(req, res) {
	var meme = req.body;
	db.Meme.create({
		meme_name: meme.meme_name,
		meme_text: meme.meme_text,
		og_img: meme.og_img,
		new_img: meme.new_img,
		tags: meme.tags,
		UserId: req.params.userID,
		PortfolioId: req.params.portfolioID
	}).then(() => {
		console.log('Successfully added meme: ' + req.body.meme_name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while adding meme: ' + req.body.meme_name).end();
	});	
});


// PUT Routes
// ====================================================================

// A user updates a Meme
router.put("/api/:userID/update-meme/:memeID", function(req, res) {
	var meme = req.body;
	db.Meme.update({
		meme_name: meme.meme_name,
		meme_text: meme.meme_text,
		og_img: meme.og_img,
		new_img: meme.new_img,
		tags: meme.tags,
		PortfolioId: meme.portfolioID,
		UserId: req.params.userID
	}, {
		where: {
			UserId: req.params.userID,
			id: req.params.memeID
		}
	}).then(() => {
		console.log('Successfully updated meme: ' + req.body.meme_name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while updating meme: ' + req.body.meme_name).end();
	});
});


// DELETE Routes
// ====================================================================

// A user deletes a meme
router.delete("/api/:userID/delete-meme/:memeID", function(req, res) {
	db.Meme.destroy({
		where: {
			userId: req.params.userID,
			id: req.params.memeID
		}
	}).then((result) => {
		res.json(result);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});

module.exports = router;
