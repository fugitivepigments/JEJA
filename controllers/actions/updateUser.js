const { Op, User, Meme, Portfolio } = require("../utils");

// Handle requests to update the logged in user
module.exports = function(req, res) {
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
			id: {
                [Op.eq]: req.user.id
            }
		}
	}).then((response) => {
		// response is an array with either 1(successful) or 0(failed)
		if(response[0] === 1){
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
				console.log('Successfully updated user: ' + req.body.name);

				// Returns a JSON object containing the current user
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
}