const { Op, fs, User, Meme } = require("../utils");

// deletes the currently logged in user from the database
module.exports = function(req, res) {
	console.log('Inside Delete User authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested update: ', req.body);

	User.destroy({
		where: {
			id: {
                [Op.eq]: req.user.id
            }
		}
	}).then((result) => {

		// Redirects the user to the logout route
		res.redirect("/logout");

	}).catch((err) => {
		res.status(500).send(err.message);
	});
}