// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// GET Routes
// ====================================================================

// Displays a users details
router.get("/user/:userID", function(req, res) {
	db.Meme.findById(req.params.userID).then((results) => {
		// TODO: Need to update 
		console.log(results);
		res.render("user", {user: results.dataValues});
	}).catch((err) => {
		res.status(500).end();
	});
});

// POST Routes
// ====================================================================

// Add a new User
router.post("/api/new-user", function(req, res) {
	var user = req.body;
	db.User.create({
		name: user.name,
		email: user.email,
		password: user.password
	}).then(() => {
		console.log('Successfully added user: ' + req.body.name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while adding user: '+ req.body.name).end();
	});	
});


// PUT Routes
// ====================================================================

// Update a user
router.put("/api/update-user/:userID", function(req, res) {
	var user = req.body;
	db.User.update({
		name: user.name,
		email: user.email
	}, {
		where: {
			UserId: req.params.userID
		}
	}).then(() => {
		console.log('Successfully updated user: ' + req.body.name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while updating meme: ' + req.body.name).end();
	});
});


// DELETE Routes
// ====================================================================

// Delete a user
router.delete("/api/:userID/delete-meme/:memeID", function(req, res) {
	db.User.destroy({
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