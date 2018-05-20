// Dependencies
const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt-nodejs");

// Require all models
// const db = require("../models");


// GET Routes
// ====================================================================

// Displays a single user's details --GOOD
// router.get("/user/:userID", function(req, res) {
// 	db.User.findOne({
// 		where: {
// 			id: parseInt(req.params.userID)
// 		},
// 		include: [
// 			{model: db.Meme}, 
// 			{model: db.Portfolio}
// 		],
// 		order: [
// 			[db.Meme, 'createdAt', 'DESC'],
// 			[db.Portfolio, 'createdAt', 'DESC']
// 		]
// 	}).then((user) => {
// 		res.render("user", user.dataValues);
// 	}).catch((err) => {
// 		res.status(500).end();
// 	});
// });


// POST Routes
// ====================================================================

// Add a new User (securely) --GOOD
// router.post("/api/new-user", function(req, res) {
// 	var user = req.body;

// 	// Encrypt password
// 	bcrypt.hash(req.body.password, null, null, function(err, hash){
// 		db.User.create({
// 			name: user.name,
// 			email: user.email,
// 			password: hash
// 		}).then((result) => {
// 			console.log('Successfully added user: ' + req.body.name);
// 			res.json(result);
// 		}).catch((err) => {
// 			res.status(500).send('Error while adding user: '+ req.body.name).end();
// 		});	
// 	});

// });

// Login a user (securely) --GOOD
// router.post("/login", function(req, res) {
// 	db.User.findOne({
// 		where: {
// 			email: req.body.email
// 		}
// 	}).then((user) => {
// 		bcrypt.compare(req.body.password, user.password, function(err, response){
// 			if (response){
// 				console.log('Successful login: ' + user.email)
// 				res.json(user);
// 			}
// 		});
// 	}).catch((err) => {
// 		res.status(500).end();
// 	});
// });


// PUT Routes
// ====================================================================

// Update a user --GOOD
// router.put("/api/update-user/:userID", function(req, res) {
// 	var user = req.body;
// 	db.User.update({
// 		name: user.name,
// 		email: user.email
// 	}, {
// 		where: {
// 			id: parseInt(req.params.userID)
// 		}
// 	}).then((response) => {
// 		// response is an array with either 1(successful) or 0(failed)
// 		if(response[0] === 1){
// 			db.User.findOne({
// 				where: {
// 					id: parseInt(req.params.userID)
// 				},
// 				include: [
// 					{model: db.Meme}, 
// 					{model: db.Portfolio}
// 				],
// 				order: [
// 					[db.Meme, 'createdAt', 'DESC'],
// 					[db.Portfolio, 'createdAt', 'DESC']
// 				]
// 			}).then((user) => {
// 				console.log('Successfully updated user: ' + req.body.name);
// 				res.json(user.dataValues);
// 			}).catch((err) => {
// 				res.status(500).end();
// 			});
// 		} else {
// 			res.json(response[0]);
// 		}
// 	}).catch((err) => {
// 		res.status(500).send('Error while updating meme: ' + req.body.name).end();
// 	});
// });


// DELETE Routes
// ====================================================================

// Delete a user -- NEED TO USE
// router.delete("/api/delete-user/:userID", function(req, res) {
// 	db.User.destroy({
// 		where: {
// 			id: req.params.userID
// 		}
// 	}).then((result) => {
// 		// should return either 1 or 0
// 		res.json(result);
// 	}).catch((err) => {
// 		res.status(500).send(err.message);
// 	});
// });

module.exports = router;