const { Op, Artwork, Meme } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Search authcontroller');
    console.log('Logged in user: ', req.user);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body);
    console.log('Request params: ', req.params);

    // TODO: enhance Meme model to include association with
    // Artwork so that we can see how many users have created
    // a meme using the same artwork

	// Search for all Artwork that match the query
    Artwork.findAndCountAll({
        where: {
            [Op.or]: [
            {title: {[Op.like]: '%' + req.query.q + '%'}},
            {author: {[Op.like]: '%' + req.query.q + '%'}}
            ]
        }
    }).then((resArtworks) => {
        let artworks = [];
        for (var i = 0; i < resArtworks.rows.length; i++) {
            artworks.push(resArtworks.rows[i].dataValues);
        }

        // Search for all Memes that match the query
        Meme.findAndCountAll({
            where: {
                [Op.or]: [
                    {meme_name: {[Op.like]: '%' + req.query.q + '%'}},
                    {meme_text: {[Op.like]: '%' + req.query.q + '%'}}
                ]
            }
        }).then((resMemes) => {

            let memes = [];
            for (var i = 0; i < resMemes.rows.length; i++) {
                memes.push(resMemes.rows[i].dataValues);
            }

            // Redirects user to searchresults page & displays matched artwork and memes
            res.render("searchResults", {
                artworks: {data: artworks, results: resArtworks.count},
                memes: {data: memes, results: resMemes.count}
            });

        }).catch(err => {
            res.status(500).end();
        });
    }).catch(err => {
        res.status(500).end();
    });
}