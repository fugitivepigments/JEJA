// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// GET Routes
// ====================================================================

// Display the Index page
router.get("/", function(req, res) {

});

// POST Routes
// ====================================================================

// A User adds a new Meme
router.post("/api/:userID/new-meme", function(req, res) {

});

// Add a new User
router.post("/api/new-user", function(req, res) {

});

// Add a new User
router.post("/api/:userID/new-portfolio", function(req, res) {

});

// PUT Routes
// ====================================================================

// A user updates a Meme
router.put("/api/:userID/update-meme/:memeID", function(req, res) {

});

// A user updates a Meme
router.put("/api/:userID/update-portfolio/:portfolioID", function(req, res) {

});

// DELETE Routes
// ====================================================================

// A user updates a meme
router.delete("/api/:userID/delete-meme/:memeID", function(req, res) {

});

// A user updates a meme
router.delete("/api/:userID/delete-portfolio/:portfolioID", function(req, res) {

});

module.exports = router;
