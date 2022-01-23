const { Op, Portfolio, Meme, User } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Portfolio authcontroller');
    console.log('Logged in user: ', req.user);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    Portfolio.findOne({
        where: {
            id: {
                [Op.eq]: req.params.portfolioID
            },
            UserId: {
                [Op.eq]: req.user.id
            }
        },
        include: [
            {model: Meme}, 
            {model: User}
        ],
    }).then((results) => {
        // Redirects the user to the Portfolio page and displays the selected portfolio
        res.render("portfolio", results.dataValues);

    }).catch((err) => {
        res.status(500).end();
    });
}