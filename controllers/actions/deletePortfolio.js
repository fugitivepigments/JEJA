const { Op, Portfolio } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Delete Portfolio authcontroller');
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    Portfolio.destroy({
        where: {
            id: {
                [Op.eq]: req.body.portfolioID
            },
            userId: {
                [Op.eq]: req.user.id
            }
        }
    }).then((result) => {
        // Result with either be 1(successful) or 0(failed)
        Portfolio.findAll().then(portfolioList => {
            portfolios = [];
            for (var i = 0; i < portfolioList.length; i++) {
                portfolios.push(portfolioList[i].dataValues);
            }

            // Returns a JSON object of the remaining Portfolios
            res.json(portfolios);

        });
    }).catch((err) => {
        res.status(500).send(err.message);
    });
}