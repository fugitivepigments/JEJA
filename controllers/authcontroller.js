var exports = module.exports = {}
var User = require("../models").User;
var Meme = require("../models").Meme;
var Portfolio = require("../models").Portfolio;
var Artwork = require("../models").Artwork;
 
exports.signup = function(req, res) {
 
 	console.log('Inside signup authcontroller');
 	if(req.user){
 		// res.render("/", {id: req.user.id, name: req.user.name});
		res.json({
			id: req.user.id, 
			name: req.user.name
		});
 	} else {
    	res.render('signup');
 	}
    // res.render('signup');

 //    res.json({
	// 	id: req.user.id, 
	// 	name: req.user.name
	// });
 
};

exports.signin = function(req, res) {
 
 	console.log('Inside signin authcontroller');
 	console.log('req.user: ', req.user);
 	if(req.user){
 		// res.render("/", {id: req.user.id, name: req.user.name});
		res.json({
			id: req.user.id, 
			name: req.user.name
		});
 	} else {
    	res.render('signin');
 	}
 
};

// Logs the user out and redirects them to the home page
exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');

    });
 
};

// Displays all memes from all users
exports.community = function(req, res) {

	User.findAll({
		include: [
			{model: Meme}, 
			{model: Portfolio}
		],
		order: [
			[Meme, 'createdAt', 'DESC'],
			[Portfolio, 'createdAt', 'DESC']
		]
	}).then((results) => {
		var users = [];
		for (var i = 0; i < results.length; i++) {
			users.push(results[i].dataValues);
		}

		res.render("community", {users: users});

	}).catch((err) => {

		res.status(500).end();

	});
};


// Only allows the current user to view their own Account Details
exports.user = function(req, res) {

	console.log('Inside User authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested page: ', req._parsedOriginalUrl.path);
	console.log('Requested Account Details for User: ', req.params.userID);

	User.findOne({
		where: {
			id: req.user.id
		},
		include: [
			{model: Meme}, 
			{model: Portfolio}
		],
		order: [
			[Meme, 'createdAt', 'DESC'],
			[Portfolio, 'createdAt', 'DESC']
		]
	}).then((user) => {
		res.render("user", user.dataValues);
	}).catch((err) => {
		res.status(500).end();
	});
};

// Handle requests to update the logged in user
exports.updateUser = function(req, res) {
	console.log('Inside User Update authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested update: ', req.body);

	var user = req.body;
	User.update({
		name: user.name,
		email: user.email
	}, {
		where: {
			id: req.user.id
		}
	}).then((response) => {
		// response is an array with either 1(successful) or 0(failed)
		if(response[0] === 1){
			User.findOne({
				where: {
					id: req.user.id
				},
				include: [
					{model: Meme}, 
					{model: Portfolio}
				],
				order: [
					[Meme, 'createdAt', 'DESC'],
					[Portfolio, 'createdAt', 'DESC']
				]
			}).then((user) => {
				console.log('Successfully updated user: ' + req.body.name);
				res.json(user.dataValues);
			}).catch((err) => {
				res.status(500).end();
			});
		} else {
			res.json(response[0]);
		}
	}).catch((err) => {
		res.status(500).send('Error while updating meme: ' + req.body.name).end();
	});
};

exports.deleteUser = function(req, res) {
	// deletes the currently logged in user from the database
	console.log('Inside User Update authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested update: ', req.body);

	User.destroy({
		where: {
			id: req.user.id
		}
	}).then((result) => {
		// log the user out
		res.redirect("/logout");
	}).catch((err) => {
		res.status(500).send(err.message);
	});
};

exports.deleteMeme = function(req, res) {
	// deletes the currently logged in user from the database
	console.log('Inside Delete Meme authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Meme to delete: ', req.body);

	Meme.destroy({
		where: {
		  id: parseInt(req.body.memeId),
		  userId: req.user.id
		}
	}).then((result) => {
		// Result with either be 1(successful) or 0(failed)
		res.json(result);
	}).catch((err) => {
		console.log('You cannot delete this meme');
		res.status(500).send(err.message);
	});
};

exports.createMeme = function(req, res) {
	Artwork.findOne({
		where: {
		  id: parseInt(req.params.artworkID)
		}
	}).then((results) => {
		res.render("new", results.dataValues);
	}).catch((err) => {
		res.status(500).end();
	});
}

exports.editMeme = function(req, res) {
	console.log('Inside Edit Meme authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Meme to edit: ', req.body);

	Meme.findOne({
		where: {
		  id: parseInt(req.body.memeId),
		  UserId: req.user.id
		}
	}).then((results) => {
		res.render("edit", results.dataValues);
		// TODO: return json
	}).catch((err) => {
		res.status(500).end();
	});
}

exports.collection = function(req, res) {

	// Returns only the current user's collection
  Meme.findAll({
    where: {
      UserId: req.user.id
    },
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(results => {

    // Retrieve meme data from results
    var memes = [];
    for (var i = 0; i < results.length; i++) {
      memes.push(results[i].dataValues);
    }

    res.render("collection", {
      memes: memes
    });
  }).catch(err => {
    res.status(500).end();
  });
};

exports.deletePortfolio = function(req, res) {
	Portfolio.destroy({
		where: {
			id: req.body.portfolioID,
			userId: req.user.id
		}
	}).then((result) => {
		// Result with either be 1(successful) or 0(failed)
		Portfolio.findAll().then(portfolioList => {
			portfolios = [];
			for (var i = 0; i < portfolioList.length; i++) {
				portfolios.push(portfolioList[i].dataValues);
			}
			res.json(portfolios);
		});
	}).catch((err) => {
		res.status(500).send(err.message);
	});
}