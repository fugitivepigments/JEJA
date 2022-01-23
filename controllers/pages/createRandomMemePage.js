const { ARTWORK_COUNT } = require("../utils");

// Redirects user to the new page and displays a random meme
module.exports = function(req, res) {
    console.log('Inside Create Meme From Random authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	var randomID = Math.floor(Math.random() * ARTWORK_COUNT);

	res.redirect("/create-meme/" + randomID);
}