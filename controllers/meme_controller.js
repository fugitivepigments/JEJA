// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// Redirect users to the /index route.
router.get("/", function(req, res) {
	res.redirect("/index");
});

// Get/Read/display a list of all burgers
router.get("/index", function(req, res) {

	// Retrieve list of burgers with associated customers and display in ascending order
	db.Burger.findAll({include: [ db.Customer ], order: [['burger_name', 'ASC']]}).then((burger_data) => {
		
		// Retrieve list of customers with associated list of devoured burgers
		db.Customer.findAll({include: [ db.Burger ], order: [['customer_name', 'ASC']]}).then((customer_data) => {

			// Create a list of devoured burgers
			var devouredBurgers = burger_data.filter(burger => {
				return burger.devoured;
			});

			// Create a list of burgers that can be devoured
			var availBurgers = burger_data.filter(burger => {
				return !burger.devoured;
			});

			// Update the View with the retrieved data
			res.render("index", {
				burgers: {
					devouredBurgers: devouredBurgers,
					availBurgers: availBurgers
				},
				customers: customer_data
			});
		}).catch((err) => {
			res.status(500).send('Error while pulling a list of customers').json({
				error: err.message
			});
		});

	}).catch((err) => {
		res.status(500).send('Error while pulling a list of burgers').json({
			error: err.message
		});
	});
});

// Post/Create/Add a new burger
router.post("/api/new-burger", function(req, res) {
	var burger = req.body;
	db.Burger.create(burger).then(() => {
		console.log('Successfully added burger: ' + req.body.burger_name);
		res.redirect(200, "/index");
	}).catch((err) => {
		res.status(500).send('Error while adding a burger').end();
	});	
});

// Post/Create/Add a new burger
router.post("/api/new-customer", function(req, res) {
	var customer = req.body;
	db.Customer.create(customer).then(() => {
		console.log('Successfully added customer: ' + req.body.customer_name);
		res.redirect(200, "/index");
	}).catch((err) => {
		res.status(500).send('Error while adding a customer').end();
	});
});

// A customer eats a burger
router.put("/api/:customerId/eat/:burgerId", function(req, res) {

	// Set the burger's devoured status to true
	db.Burger.update({
		devoured: true,
		CustomerId: req.params.customerId
	}, {
		where: {
			id: req.params.burgerId
		}
	}).then(() => {
		console.log('Successfully devoured burger:' + req.params.burgerId);
		res.redirect(200, "/index");
	}).catch((err) => {
		// Error while updating the burger's devoured status
		res.status(500).send("Error while updating the burger's devoured status").end();
	});
});

module.exports = router;