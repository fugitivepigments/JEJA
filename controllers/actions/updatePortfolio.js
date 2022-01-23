const { Op, Portfolio } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Update Portfolio authcontroller');
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    Portfolio.update({
        portfolio_name: req.body.portfolio_name
    }, {
        where: {
            id: {
                [Op.eq]: req.params.portfolioID
            },
            UserId: {
                [Op.eq]: req.user.id
            }
        }
    }).then(() => {
        console.log('Successfully updated portfolio: ' + req.params.portfolioID);
        Portfolio.findOne({
            where: {
                id: {
                    [Op.eq]: req.params.portfolioID
                }
            }
        }).then((result) => {

            // Return a JSON object of the updated portfolio
            res.json(result.dataValues);

        }).catch((err) => {
            res.status(500).send('Error while fetching portfolio: ' + req.params.portfolioID).end();
        });
    }).catch((err) => {
        res.status(500).send('Error while updating portfolio: ' + req.params.portfolioID).end();
    });
}