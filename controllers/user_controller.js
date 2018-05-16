// Dependencies
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt-nodejs");

// Require all models
var db = require("../models");

// GET Routes
// ====================================================================

// Displays a single user's details
router.get("/user/:userID", function(req, res) {
	db.User.findOne({
		where: {
			id: parseInt(req.params.userID)
		},
		include: [
			{model: db.Meme}, 
			{model: db.Portfolio}
		],
		order: [
			[db.Meme, 'createdAt', 'DESC'],
			[db.Portfolio, 'createdAt', 'DESC']
		]
	}).then((user) => {
		res.render("user", user.dataValues);
	}).catch((err) => {
		res.status(500).end();
	});
});

// Displays all User 
router.get("/community", function(req, res) {
	db.User.findAll({
		include: [
			{model: db.Meme}, 
			{model: db.Portfolio}
		],
		order: [
			[db.Meme, 'createdAt', 'DESC'],
			[db.Portfolio, 'createdAt', 'DESC']
		]
	}).then((results) => {
		console.log(results[0].dataValues);

		var users = [];
		for (var i = 0; i < results.length; i++) {
			users.push(results[i].dataValues);
		}

		res.render("community", {users: users});
	}).catch((err) => {
		res.status(500).end();
	});
});

// POST Routes
// ====================================================================

// Add a new User
router.post("/api/new-user", function(req, res) {
	var user = req.body;
	// Encrypt password
	bcrypt.hash(req.body.password, null, null, function(err, hash){
		db.User.create({
			name: user.name,
			email: user.email,
			password: hash
		}).then((result) => {
			console.log('Successfully added user: ' + req.body.name);
			res.json(result);
		}).catch((err) => {
			res.status(500).send('Error while adding user: '+ req.body.name).end();
		});	
	});

});

// Log a user in
router.post("/login", function(req, res) {
	db.User.findOne({
		where: {
			email: req.body.email
		}
	}).then((user) => {
		bcrypt.compare(req.body.password, user.password, function(err, response){
			if (response){
				console.log('Successful login: ' + user.email)
				res.json(user);
			}
		});
	}).catch((err) => {
		res.status(500).end();
	});
});

// PUT Routes
// ====================================================================

// Update a user
router.put("/api/update-user/:userID", function(req, res) {
	var user = req.body;
	console.log('Inside user update');
	db.User.update({
		name: user.name,
		email: user.email
	}, {
		where: {
			id: parseInt(req.params.userID)
		}
	}).then((user) => {
		console.log('Successfully updated user: ' + req.body.name);
		res.json(user);
	}).catch((err) => {
		res.status(500).send('Error while updating meme: ' + req.body.name).end();
	});
});


// DELETE Routes
// ====================================================================

// TODO: Delete a user
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