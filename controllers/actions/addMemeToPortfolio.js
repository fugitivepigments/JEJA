const { Op, Portfolio, Meme } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Add Meme to Portfolio authcontroller');
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    Meme.update({
        PortfolioId: req.body.portfolioID
    }, {
        where: {
            id: {
                [Op.eq]: req.body.memeID
            },
            UserId: {
                [Op.eq]: req.user.id
            }
        }
    }).then((success) => {
        Portfolio.update({
            cover_img: req.body.cover_img
        }, {
            where: {
                id: {
                    [Op.eq]: req.body.portfolioID
                }
            }
        }).then(result => {
            console.log('Successfully added meme to portfolio: ' + req.body.portfolioID);
            Portfolio.findAll().then(portfolioList => {
                let portfolios = [];
                for (var i = 0; i < portfolioList.length; i++) {
                    portfolios.push(portfolioList[i].dataValues);
                }

                // Returns a JSON object of all Portfolios
                res.json(portfolios);

            });
        }).catch((err) => {
            res.status(500).send('Error finding portfolio: ' + req.body.portfolioID).end();
        });
    }).catch((err) => {
        res.status(500).send('Error adding meme to portfolio: ' + req.body.portfolioID).end();
    });
}