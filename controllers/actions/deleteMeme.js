const { Op,fs, Meme, deleteFileFromCloud } = require("../utils");

// deletes a meme from the database
//TODO: delete the image from Google Cloud Storage as well
module.exports = function(req, res) {
	console.log('Inside Delete Meme authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Meme to delete: ', req.body);

    let filename = req.body.fileName;

	Meme.destroy({
        where: {
            id: {
                [Op.eq]: parseInt(req.body.memeId)
            },
            userId: {
                [Op.eq]: req.user.id
            }
		}
	}).then((result) => {
        
        // TODO: delete image from server
        fs.unlink(__dirname + '/../../public/images/' + filename, (err) => {
            if (err) {
                return console.error(err)
            }
            // TODO: delete image from Google Cloud Storage
            deleteFileFromCloud(filename);
        })


		// Returns a JSON object indicating the success(1) or failure(0) of the request
		res.json(result);

	}).catch((err) => {
		console.log('Deletion unsuccessful:', err);
		res.status(500).send(err.message);
	});
}