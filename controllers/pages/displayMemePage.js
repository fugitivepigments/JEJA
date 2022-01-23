const { Op, Meme } = require("../utils");

// Displays the selected Meme
module.exports = function(req, res) {
    console.log('Inside Edit Meme authcontroller');
    console.log('Logged in user: ', req.user);
    console.log('SessionID: ', req.sessionID);
    console.log('Meme to edit: ', req.params);

    Meme.findOne({
        where: {
            id: {
                [Op.eq]: parseInt(req.params.memeID)
            }
        }
    }).then((selectedMeme) => {
        res.render("view", selectedMeme.dataValues);
    }).catch((err) => {
        console.log("User cannot edit this meme");
        res.status(500).end();
    });
}