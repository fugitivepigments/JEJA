const { Op, Artwork } = require("../utils");

// Redirects user to the create-meme page and displays the selected artwork
module.exports = function(req, res) {
    console.log('Inside Create Meme authcontroller');
    console.log('Logged in user: ', req.user ? (({password, ...others}) => ({...others}))(req.user) : {});
    console.log('SessionID: ', req.sessionID);
    console.log('Artwork to use: ', req.params);

    Artwork.findOne({
        where: {
            id: {
                [Op.eq]: parseInt(req.params.artworkID)
            }
        }
    }).then((results) => {
        res.render("new", results.dataValues);
    }).catch((err) => {
        res.status(500).end();
    });
}