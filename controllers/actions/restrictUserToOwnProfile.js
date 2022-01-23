const { Op, User, Meme, Portfolio } = require("../utils");

// Only allows the current user to view their own Account Details
module.exports = function(req, res) {
    console.log('Inside User authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested page: ', req._parsedOriginalUrl.path);
	console.log('Requested Account Details for User: ', req.params.userID);

	User.findOne({
		where: {
			id: {
                [Op.eq]: req.user.id
            }
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

		// Redirects the user to the user page and displays the authenticated user
		res.render("user", user.dataValues);

	}).catch((err) => {
		res.status(500).end();
	});
}