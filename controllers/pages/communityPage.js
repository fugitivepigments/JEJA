const { User, Meme, Portfolio } = require("../utils");

// Displays all memes from all users
module.exports = function(req, res) {
    console.log('Inside Community authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

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
		// Redirects the user to the community page and displays all users
        // and their memes and portfolios
		res.render("community", {
            users: users
        });
	}).catch((err) => {
		res.status(500).end();
	});
}