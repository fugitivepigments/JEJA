const { Op, Meme } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Collection JSON authcontroller');
    console.log('Logged in user: ', req.user);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    Meme.findAll({
        where: {
            UserId: {
                [Op.eq]: req.params.userID
            }
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(results => {

    // Retrieve meme data from results
    var memes = [];
    for (var i = 0; i < results.length; i++) {
        memes.push(results[i].dataValues);
    }

    // Returns a JSON object of the authenticated user's Memes
    res.json(memes);

    }).catch(err => {
        res.status(500).end();
    });
}