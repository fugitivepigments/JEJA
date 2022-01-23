const { Op, Meme } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Collection authcontroller');
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    // Returns only the current user's collection
    Meme.findAll({
        where: {
            UserId: {
                [Op.eq]: req.user.id
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

        // Redirects user to the collections page & displays memes data
        res.render("collection", {
            memes: memes
        });

    }).catch(err => {
        res.status(500).send(`Error message: ${err}`).end();
    });
}