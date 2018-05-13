// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// GET Routes
// ====================================================================

// Displays a users details
router.get("/portfolio/:portfolioID", function(req, res) {
	db.Meme.findById(req.params.portfolioID).then((results) => {
		// TODO: Need to update 
		console.log(results);
		res.render("portfolio", {portfolio: results.dataValues});
	}).catch((err) => {
		res.status(500).end();
	});
});


// POST Routes
// ====================================================================

// Add a new portfolio
router.post("/api/:userID/new-portfolio", function(req, res) {
	var portfolio = req.body;
	db.Portfolio.create({
		portfolio_name: portfolio.portfolio_name,
		UserId: req.params.userID
	}).then(() => {
		console.log('Successfully added portfolio: ' + req.body.portfolio_name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while adding portfolio: ' + req.body.portfolio_name).end();
	});	
});

// PUT Routes
// ====================================================================

// A user updates a portfolio
router.put("/api/:userID/update-portfolio/:portfolioID", function(req, res) {
	var portfolio = req.body;
	db.Portfolio.update({
		portfolio_name: portfolio.portfolio_name
	}, {
		where: {
			UserId: req.params.userID,
			id: req.params.portfolioID
		}
	}).then(() => {
		console.log('Successfully updated portfolio: ' + req.body.portfolio_name);
		res.redirect(200, "/");
	}).catch((err) => {
		res.status(500).send('Error while updating portfolio: ' + req.body.portfolio_name).end();
	});
});

// DELETE Routes
// ====================================================================

// A user deletes a portfolio
router.delete("/api/:userID/delete-portfolio/:portfolioID", function(req, res) {
	db.Portfolio.destroy({
		where: {
			userId: req.params.userID,
			id: req.params.portfolioID
		}
	}).then((result) => {
		res.json(result);
	}).catch((err) => {
		res.status(500).send(err.message);
	});
});

module.exports = router;