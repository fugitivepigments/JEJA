// Dependencies
var express = require("express");
var router = express.Router();
var fs = require("fs");
var Sequelize = require("sequelize");

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
		limit: 1,
		offset: offset
	}).then((results1) => {
		offset = Math.floor(Math.random() * 44800);
		db.Artwork.findAndCountAll({
			limit: 1,
			offset: offset
		}).then((results2) => {
			offset = Math.floor(Math.random() * 44800);
			db.Artwork.findAndCountAll({
				limit: 1,
				offset: offset
			}).then((results3) => {
				// Reformat results to make it easier to display data in views
				var art = [];
				art.push(results1.rows[0].dataValues);
				art.push(results2.rows[0].dataValues);
				art.push(results3.rows[0].dataValues);

				// console.log(art);

				// Send results to index.handlebars
				res.render("index", {artworks: art});
			}).catch((err) => {
				res.status(500).end();
			});
		}).catch((err) => {
			res.status(500).end();
		});
	}).catch((err) => {
		res.status(500).end();
	});
});

// Displays the Meme Editor page with a random img
router.get("/meme-editor", function(req, res) {
	var randomID = Math.floor(Math.random() * 44800); 
	res.redirect("/meme-editor/" + randomID);
});

// Displays the Meme Editor page
router.get("/meme-editor/:artworkID", function(req, res) {
	db.Artwork.findOne({
		where: {
			id: parseInt(req.params.artworkID)
		}
	}).then((results) => {
		res.render("editor", results.dataValues);
	}).catch((err) => {
		res.status(500).end();
	});
});

// Displays the collection of all memes
router.get("/collection", function(req, res) {
	// res.render("collection");

	db.Meme.findAll({order: [['createdAt', 'DESC']]}).then(results => {

		// Retrieve meme data from results
		var memes = [];
		for (var i = 0; i < results.length; i++) {
			memes.push(results[i].dataValues);
		}
		res.render("collection", {memes: memes});
	}).catch(err => {
		res.status(500).end();
	});
});

// Search
router.get("/search", function(req, res) {
	// generate a random offset
	// artwork.Title, artwork.author , meme.meme_text, meme.meme_name
	const Op = Sequelize.Op;
	db.Artwork.findAll({
		title: {
			[Op.like]: '%' + req.body.searchInput + '%'
		}
	}).then((results) => {

		artworks = [];
		for (var i = 0; i < results.length; i++) {
			artworks.push(results[i].dataValues);
		}
		console.log(artworks);
		res.render("searchResults", {results: artworks});
	}).catch(err => {
		res.status(500).end();
	});
});

// POST Routes
// ====================================================================

// A user adds a new meme (without a Portfolio)
router.post("/api/:userID/new-meme", function(req, res) {
	var meme = req.body;

	var img = req.body.new_img;
	var data = img.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	var filename = req.body.meme_name + '.png';
	var num = 0;

	createMemeImage(filename);

	function createMemeImage(filename){
		// use fs.writeFile to save image on server under images dir
		fs.writeFile(__dirname + '/../public/images/' + filename ,buf, {flag: 'wx'}, err => {
		    if(err){
				// If the filename already exists, increment a counter until an 
				// available filename is found
		    	if(err.code === "EEXIST") {
		    		num++;
		    		console.log('Filename exists...creating new filename');
		    		filename = req.body.meme_name + " ("+ num +").png";
		    		createMemeImage(filename);
		    		return; 
		    	} else {
		    		console.log('Error', err.code);
		        	return console.error(err);
		    	}
		    }

			// Make sure the user exists
			db.User.findOne({
				where: {
					id: parseInt(req.params.userID)
				}
			}).then(user => {

				// After the user's record has been found, associate the meme to the user
				db.Meme.create({
					meme_name: meme.meme_name,
					meme_text: meme.meme_text,
					og_img: meme.og_img,
					new_img: '/images/' + filename,
					tags: meme.tags,
					UserId: parseInt(req.params.userID)
				}).then((success) => {
					console.log('Successfully added meme: ' + req.body.meme_name);
					res.json(success);
				}).catch((err) => {
					res.status(500).json(err.message).end();
				});	
			}).catch(err => {
				res.status(500).json(err.message).end();
			});

		    console.log('image has been created');
		});
	}

});

// TODO: A user adds a new meme (with a Portfolio)
router.post("/api/:userID/:portfolioID/new-meme", function(req, res) {
	var meme = req.body;
	db.Meme.create({
		meme_name: meme.meme_name,
		meme_text: meme.meme_text,
		og_img: meme.og_img,
		new_img: meme.new_img,
		tags: meme.tags,
		UserId: parseInt(req.params.userID),
		PortfolioId: parseInt(req.params.portfolioID)
	}).then(() => {
		console.log('Successfully added meme: ' + req.body.meme_name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while adding meme: ' + req.body.meme_name).end();
	});	
});


// PUT Routes
// ====================================================================

// TODO: A user updates a Meme
router.put("/api/:userID/update-meme/:memeID", function(req, res) {
	var meme = req.body;
	db.Meme.update({
		meme_name: meme.meme_name,
		meme_text: meme.meme_text,
		og_img: meme.og_img,
		new_img: meme.new_img,
		tags: meme.tags,
		PortfolioId: parseInt(meme.portfolioID),
		UserId: parseInt(req.params.userID)
	}, {
		where: {
			UserId: parseInt(req.params.userID),
			id: parseInt(req.params.memeID)
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

// TODO: A user deletes a meme
router.delete("/api/:userID/delete-meme/:memeID", function(req, res) {
	db.Meme.destroy({
		where: {
			userId: parseInt(req.params.userID),
			id: parseInt(req.params.memeID)
		}
	}).then((result) => {
		res.json(result);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});

module.exports = router;
