const { Op, Portfolio } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Save Portfolio authcontroller');
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    var portfolio = req.body;
    Portfolio.create({
        portfolio_name: portfolio.portfolio_name,
        cover_img: portfolio.cover_img,
        UserId: req.user.id
    }).then(() => {
        console.log('Successfully added portfolio: ' + req.body.portfolio_name);
        Portfolio.findAll({
            where: {
                UserId: {
                    [Op.eq]: req.user.id
                }
            }
        }).then(results => {
            var portfolios = [];
            results.forEach( function(element, index) {
                portfolios.push(element.dataValues);
            });
            
            // Returns a JSON object of the newly created Portfolio
            res.json(portfolios);
        })
    }).catch((err) => {
        res.status(500).send('Error while adding portfolio: ' + req.body.portfolio_name).end();
    });
}