const { Op, fs, User, Meme, uploadFileToCloud } = require("../utils");

module.exports = function(req, res) {
    console.log('Inside Update Meme authcontroller');
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    console.log('Request body: ', req.body.meme_text);
    console.log('Request params: ', req.params);

    let meme = req.body;

    let img = req.body.new_img;
    let data = img.replace(/^data:image\/\w+;base64,/, "");
    let buf = new Buffer.from(data, 'base64');
    let filename = req.body.meme_name + '.png';
    let num = 0;

    function updateMemeImage(filename) {
        // use fs.writeFile to save image on server under images dir
        // Allow files to be overridden
        fs.writeFile(__dirname + '/../../public/images/' + filename, buf, err => {
            if (err) {
            // If the filename already exists, increment a counter until an
            // available filename is found
            if (err.code === "EEXIST") {
                num++;
                console.log('Filename exists...creating new filename');
                filename = req.body.meme_name + "_" + num + ".png";
                updateMemeImage(filename);
                return;
            } else if (err.code === "ENOENT") {
                console.log('Did you recently nest this file or its parent folder? Review the pathname for errors.')
                return console.error(err);
            } else {
                console.log('Error', err.code);
                return console.error(err);
            }
            }

            // Upload meme to Google Cloud Storage
            uploadFileToCloud(__dirname + '/../../public/images/' + filename, filename);

            // Make sure the user exists
            User.findOne({
            where: {
                id: {
                    [Op.eq]: req.user.id
                }
            }
            }).then(user => {
            // After the user's record has been found, associate the meme to the user
            Meme.update({
                meme_name: meme.meme_name,
                meme_text: meme.meme_text,
                og_img: meme.og_img,
                new_img: 'https://storage.googleapis.com/drymemes-4a96b.appspot.com/' + filename,
                tags: meme.tags,
                UserId: req.user.id
            }, {
                where: {
                id: {
                    [Op.eq]: parseInt(req.body.id)
                },
                UserId: {
                    [Op.eq]: req.user.id
                }
                }
            }).then((success) => {
                console.log('Successfully updated meme: ' + req.body.meme_name);

                // Returns a JSON object indicating the success(1) or failure(0) of the request
                res.json(success);

            }).catch((err) => {
                console.log('The error occurrs here');
                res.status(500).json(err.message).end();
            });
            }).catch(err => {
            res.status(500).json(err.message).end();
            });

            console.log('image has been updated');
        });
    }

    updateMemeImage(filename);
}