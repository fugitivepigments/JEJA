// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// GET Routes
// ====================================================================

// Displays a portfolio
// router.get("/user/:userID/portfolio/:portfolioID", function(req, res) {
// 	db.Portfolio.findOne({
// 		where: {
// 			id: req.params.portfolioID,
// 			UserId: req.params.userID
// 		},
// 		include: [
// 			{model: db.Meme}, 
// 			{model: db.User}
// 		],
// 	}).then((results) => {
// 		// console.log(results.dataValues);
// 		res.render("portfolio", results.dataValues);
// 	}).catch((err) => {
// 		res.status(500).end();
// 	});
// });


// POST Routes
// ====================================================================

// Add a new portfolio --GOOD
// router.post("/api/:userID/new-portfolio", function(req, res) {
// 	var portfolio = req.body;
// 	db.Portfolio.create({
// 		portfolio_name: portfolio.portfolio_name,
// 		cover_img: portfolio.cover_img,
// 		UserId: req.params.userID
// 	}).then(() => {
// 		console.log('Successfully added portfolio: ' + req.body.portfolio_name);
// 		db.Portfolio.findAll({
// 			where: {
// 				UserId: req.params.userID
// 			}
// 		}).then(results => {
// 			var portfolios = [];
// 			results.forEach( function(element, index) {
// 				portfolios.push(element.dataValues);
// 			});
// 			// console.log(portfolios);
// 			res.json(portfolios);
// 		})
// 	}).catch((err) => {
// 		res.status(500).send('Error while adding portfolio: ' + req.body.portfolio_name).end();
// 	});	
// });

// PUT Routes
// ====================================================================

// Add a meme to a portfolio
// router.put("/api/add-meme-to-portfolio", function(req, res) {
// 	db.Meme.update({
// 		PortfolioId: req.body.portfolioID
// 	}, {
// 		where: {
// 			UserId: req.body.userID,
// 			id: req.body.memeID
// 		}
// 	}).then((success) => {
// 		db.Portfolio.update({
// 			cover_img: req.body.cover_img
// 		}, {
// 			where: {
// 				id: req.body.portfolioID
// 			}
// 		}).then(result => {
// 			console.log('Successfully added meme to portfolio: ' + req.body.portfolioID);
// 			db.Portfolio.findAll().then(portfolioList => {
// 				portfolios = [];
// 				for (var i = 0; i < portfolioList.length; i++) {
// 					portfolios.push(portfolioList[i].dataValues);
// 				}
// 				res.json(portfolios);
// 			});
// 		}).catch((err) => {
// 			res.status(500).send('Error finding portfolio: ' + req.body.portfolioID).end();
// 		});
// 	}).catch((err) => {
// 		res.status(500).send('Error adding meme to portfolio: ' + req.body.portfolioID).end();
// 	});
// });

// A user updates a portfolio
// router.put("/api/:userID/update-portfolio/:portfolioID", function(req, res) {
// 	var portfolio = req.body;
// 	db.Portfolio.update({
// 		portfolio_name: portfolio.portfolio_name
// 	}, {
// 		where: {
// 			UserId: req.params.userID,
// 			id: req.params.portfolioID
// 		}
// 	}).then(() => {
// 		console.log('Successfully updated portfolio: ' + req.body.portfolio_name);
// 		res.redirect(200, "/");
// 	}).catch((err) => {
// 		res.status(500).send('Error while updating portfolio: ' + req.body.portfolio_name).end();
// 	});
// });

// DELETE Routes
// ====================================================================

// A user deletes a portfolio
// router.delete("/api/:userID/delete-portfolio/:portfolioID", function(req, res) {
// 	db.Portfolio.destroy({
// 		where: {
// 			userId: req.params.userID,
// 			id: req.params.portfolioID
// 		}
// 	}).then((result) => {
// 		// Result with either be 1(successful) or 0(failed)
// 		db.Portfolio.findAll().then(portfolioList => {
// 			portfolios = [];
// 			for (var i = 0; i < portfolioList.length; i++) {
// 				portfolios.push(portfolioList[i].dataValues);
// 			}
// 			res.json(portfolios);
// 		});
// 	}).catch((err) => {
// 		res.status(500).send(err.message);
// 	});
// });

module.exports = router;