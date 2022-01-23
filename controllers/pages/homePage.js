const { Op, Artwork, Meme, ARTWORK_COUNT } = require("../utils");

let artworkWithBadUrls = [];

module.exports = function(req, res) {
    console.log('Inside Home authcontroller');
    console.log('Logged in user: ', req.user ? (({password, ...others}) => ({...others}))(req.user) : {});
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    Artwork.findAll({
    where: {
        [Op.or]: [
        {id: parseInt(Math.floor(Math.random() * ARTWORK_COUNT))},
        {id: parseInt(Math.floor(Math.random() * ARTWORK_COUNT))},
        {id: parseInt(Math.floor(Math.random() * ARTWORK_COUNT))}
        ]
    }
    }).then((artResults) => {
    var art = [];
    for (var i = 0; i < artResults.length; i++) {
        // TODO: Check if the image URL is still valid; if not get a new pic
        art.push(artResults[i].dataValues);
    }

    Meme.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: 4
    }).then((recentMemes) => {

        var memes = [];
        for (var i = 0; i < recentMemes.rows.length; i++) {
            memes.push(recentMemes.rows[i].dataValues);
        }

        // Redirect user to the index page and display 3 artworks and 4 memes
        res.render("index", {artworks: art, randomPicks: memes});

    }).catch((err) => {
        res.status(500).end();
    });

    }).catch((err) => {
        res.status(500).end();
    });
}