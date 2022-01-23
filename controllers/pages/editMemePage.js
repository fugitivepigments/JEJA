const { Op, Meme } = require("../utils");

// Redirects user to the edit meme page & displays the selected Meme
module.exports = function(req, res) {
    console.log('Inside Edit Meme authcontroller');
    console.log('Logged in user: ', req.user);
    console.log('SessionID: ', req.sessionID);
    console.log('Meme to edit: ', req.params);

    Meme.findOne({
        where: {
            id: {
                [Op.eq]: parseInt(req.params.memeID)
            },
            UserId: {
                [Op.eq]: req.user.id
            }
        }
    }).then((selectedMeme) => {
        // Redirects user to the edit page & displays the selected Meme
        res.render("edit", selectedMeme.dataValues);
    }).catch((err) => {
        console.log("User cannot edit this meme");
        res.status(500).end();
    });
}