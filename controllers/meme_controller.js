// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// Redirect users to the /index route.
router.get("/", function(req, res) {
	res.redirect("/index");
});

// Get/Read/display a list of all memes
router.get("/index", function(req, res) {

	// Retrieve list of memes with associated customers and display in ascending order
	db.Meme.findAll({include: [ db.Customer ], order: [['meme_name', 'ASC']]}).then((meme_data) => {

		// Retrieve list of customers with associated list of devoured memes
		db.Customer.findAll({include: [ db.Meme ], order: [['customer_name', 'ASC']]}).then((customer_data) => {

			// Create a list of devoured memes
			var devouredMemes = meme_data.filter(meme => {
				return meme.devoured;
			});

			// Create a list of memes that can be devoured
			var availMemes = meme_data.filter(meme => {
				return !meme.devoured;
			});

			// Update the View with the retrieved data
			res.render("index", {
				memes: {
					devouredMemes: devouredMemes,
					availMemes: availMemes
				},
				customers: customer_data
			});
		}).catch((err) => {
			res.status(500).send('Error while pulling a list of customers').json({
				error: err.message
			});
		});

	}).catch((err) => {
		res.status(500).send('Error while pulling a list of memes').json({
			error: err.message
		});
	});
});

// Post/Create/Add a new meme
router.post("/api/new-meme", function(req, res) {
	var meme = req.body;
	db.Meme.create(meme).then(() => {
		console.log('Successfully added meme: ' + req.body.meme_name);
		res.redirect(200, "/index");
	}).catch((err) => {
		res.status(500).send('Error while adding a meme').end();
	});
});

// Post/Create/Add a new meme
router.post("/api/new-customer", function(req, res) {
	var customer = req.body;
	db.Customer.create(customer).then(() => {
		console.log('Successfully added customer: ' + req.body.customer_name);
		res.redirect(200, "/index");
	}).catch((err) => {
		res.status(500).send('Error while adding a customer').end();
	});
});

// A customer eats a meme
router.put("/api/:customerId/eat/:memeId", function(req, res) {

	// Set the meme's devoured status to true
	db.Meme.update({
		devoured: true,
		CustomerId: req.params.customerId
	}, {
		where: {
			id: req.params.memeId
		}
	}).then(() => {
		console.log('Successfully devoured meme:' + req.params.memeId);
		res.redirect(200, "/index");
	}).catch((err) => {
		// Error while updating the meme's devoured status
		res.status(500).send("Error while updating the meme's devoured status").end();
	});
});

module.exports = router;
