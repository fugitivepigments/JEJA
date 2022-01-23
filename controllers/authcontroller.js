var exports = module.exports = {}
var User = require("../models").User;
var Meme = require("../models").Meme;
var Portfolio = require("../models").Portfolio;
var Artwork = require("../models").Artwork;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var fs = require("fs");

var artworkCount = 5280;

exports.home = function(req, res) {
	console.log('Inside Home authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

  Artwork.findAll({
    where: {
      [Op.or]: [
        {id: parseInt(Math.floor(Math.random() * artworkCount))},
        {id: parseInt(Math.floor(Math.random() * artworkCount))},
        {id: parseInt(Math.floor(Math.random() * artworkCount))}
      ]
    }
  }).then((artResults) => {
    var art = [];
    for (var i = 0; i < artResults.length; i++) {
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
 
exports.signupPage = function(req, res) {
	console.log('Inside Signup authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);
 
 	if(req.user){
 		// res.render("/", {id: req.user.id, name: req.user.name});
		res.json({
			id: req.user.id, 
			name: req.user.name
		});
 	} else {
    	res.render('signup');
 	}
    // res.render('signup');

 //    res.json({
	// 	id: req.user.id, 
	// 	name: req.user.name
	// });
 
};

exports.signinPage = function(req, res) {
	console.log('Inside Signin authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

 	// Check if there is a user
 	if(req.user){
 		// res.render("/", {id: req.user.id, name: req.user.name});
 		
 		// Returns a JSON object with the user's id and name
		res.json({
			id: req.user.id, 
			name: req.user.name
		});
 	} else {
    	res.render('signin');
 	}
 
};

exports.createUser_JSON = function(req, res) {
	// If sign up is successful send back json data
	console.log('New signup successful for ', req.user.name);
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	res.json({
	    id: req.user.id, 
	    name: req.user.name,
	    session: req.sessionID
	});
};

exports.signinUser_JSON = function(req, res) {
    // If sign in is successful send back json data
    console.log('Signin successful for ', req.user.name);
    console.log('Logged in user: ', req.user.id);
    console.log('SessionID: ', req.sessionID);
    // res.redirect("/");
    res.json({
        id: req.user.id, 
        name: req.user.name,
        session: req.sessionID
    });
}

// Logs the user out and redirects them to the home page
exports.logout = function(req, res) {
	console.log('Inside Logout authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);
 
    req.session.destroy(function(err) {
 
 		// Redirects the user to the home page
        res.redirect('/');

    });
 
};

// Displays all memes from all users
exports.community = function(req, res) {
	console.log('Inside Community authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	User.findAll({
		include: [
			{model: Meme}, 
			{model: Portfolio}
		],
		order: [
			[Meme, 'createdAt', 'DESC'],
			[Portfolio, 'createdAt', 'DESC']
		]
	}).then((results) => {
		var users = [];
		for (var i = 0; i < results.length; i++) {
			users.push(results[i].dataValues);
		}

		// Redirects the user to the community page and displays all users
		res.render("community", {users: users});

	}).catch((err) => {

		res.status(500).end();

	});
};


// Only allows the current user to view their own Account Details
exports.user = function(req, res) {

	console.log('Inside User authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested page: ', req._parsedOriginalUrl.path);
	console.log('Requested Account Details for User: ', req.params.userID);

	User.findOne({
		where: {
			id: req.user.id
		},
		include: [
			{model: Meme}, 
			{model: Portfolio}
		],
		order: [
			[Meme, 'createdAt', 'DESC'],
			[Portfolio, 'createdAt', 'DESC']
		]
	}).then((user) => {

		// Redirects the user to the user page and displays the authenticated user
		res.render("user", user.dataValues);

	}).catch((err) => {
		res.status(500).end();
	});
};

// Handle requests to update the logged in user
exports.updateUser_JSON = function(req, res) {
	console.log('Inside User Update authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested update: ', req.body);

	var user = req.body;
	User.update({
		name: user.name,
		email: user.email
	}, {
		where: {
			id: req.user.id
		}
	}).then((response) => {
		// response is an array with either 1(successful) or 0(failed)
		if(response[0] === 1){
			User.findOne({
				where: {
					id: req.user.id
				},
				include: [
					{model: Meme}, 
					{model: Portfolio}
				],
				order: [
					[Meme, 'createdAt', 'DESC'],
					[Portfolio, 'createdAt', 'DESC']
				]
			}).then((user) => {
				console.log('Successfully updated user: ' + req.body.name);

				// Returns a JSON object containing the current user
				res.json(user.dataValues);

			}).catch((err) => {
				res.status(500).end();
			});
		} else {
			res.json(response[0]);
		}
	}).catch((err) => {
		res.status(500).send('Error while updating meme: ' + req.body.name).end();
	});
};

exports.deleteUser = function(req, res) {
	// deletes the currently logged in user from the database
	console.log('Inside Delete User authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Requested update: ', req.body);

	User.destroy({
		where: {
			id: req.user.id
		}
	}).then((result) => {

		// Redirects the user to the logout route
		res.redirect("/logout");

	}).catch((err) => {
		res.status(500).send(err.message);
	});
};

exports.deleteMeme_JSON = function(req, res) {
	// deletes the currently logged in user from the database
	console.log('Inside Delete Meme authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Meme to delete: ', req.body);

	Meme.destroy({
		where: {
		  id: parseInt(req.body.memeId),
		  userId: req.user.id
		}
	}).then((result) => {

		// Returns a JSON object indicating the success(1) or failure(0) of the request
		res.json(result);

	}).catch((err) => {
		console.log('You cannot delete this meme');
		res.status(500).send(err.message);
	});
};

exports.createMeme = function(req, res) {
	console.log('Inside Create Meme authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Artwork to use: ', req.params);

	Artwork.findOne({
		where: {
		  id: parseInt(req.params.artworkID)
		}
	}).then((results) => {

		// Redirects user to the new page and displays the selected meme
		res.render("new", results.dataValues);

	}).catch((err) => {
		res.status(500).end();
	});
};

exports.createMemeFromRandom = function(req, res) {
	console.log('Inside Create Meme From Random authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	var randomID = Math.floor(Math.random() * artworkCount);

	// Redirects user to the new page and displays a random meme
	res.redirect("/create-meme/" + randomID);

};


// TODO: Fix this route
exports.editMeme = function(req, res) {
	console.log('Inside Edit Meme authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Meme to edit: ', req.params);

	// TODO: prevent users from editing other users' memes from search

	Meme.findOne({
		where: {
		  id: parseInt(req.params.memeID),
		  UserId: req.user.id
		}
	}).then((selectedMeme) => {
		// console.log(selectedMeme);

		console.log('Diagnositcs: before res.render(edit)');

		// TODO: Render.('edit') is not working

		// Redirects user to the edit page & displays the selected Meme
		res.render("edit", selectedMeme.dataValues);

		console.log('Diagnositcs: after res.render(edit)');

	}).catch((err) => {
		console.log("User cannot edit this meme");
		res.status(500).end();
	});
}

exports.updateMeme_JSON = function(req, res) {
	console.log('Inside Update Meme authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body.meme_text);
	console.log('Request params: ', req.params);

  var meme = req.body;

  var img = req.body.new_img;
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  var filename = req.body.meme_name + '.png';
  var num = 0;

  updateMemeImage(filename);

  function updateMemeImage(filename) {
    // use fs.writeFile to save image on server under images dir
    // Allow files to be overrided
    fs.writeFile(__dirname + '/../public/images/' + filename, buf, err => {
      if (err) {
        // If the filename already exists, increment a counter until an
        // available filename is found
        if (err.code === "EEXIST") {
          num++;
          console.log('Filename exists...creating new filename');
          filename = req.body.meme_name + "_" + num + ".png";
          updateMemeImage(filename);
          return;
        } else {
          console.log('Error', err.code);
          return console.error(err);
        }
      }

      // Upload meme to Google Cloud Storage
      uploadFile(__dirname + '/../public/images/' + filename, filename);

      // Make sure the user exists
      User.findOne({
        where: {
          id: req.user.id
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
            id: parseInt(req.body.id),
            UserId: req.user.id
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

	// Upload a file to Google Cloud Storage
	const uploadFile = (filename) => {
		// Imports the Google Cloud client library
		const Storage = require('@google-cloud/storage');

		// Creates a client
		const projectId = process.env.GC_PROJECT_ID;
		const storage = new Storage({ projectId });

		// Uploads a local file to the bucket
		storage
		.bucket(process.env.GC_BUCKET_ID)
		.upload(filename)
		.then(() => {
			// upload successful
		})
		.catch(err => {
			console.error('ERROR:', err);
		});
	}
}

exports.saveMeme_JSON = function(req, res) {
	console.log('Inside Save Meme authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body.meme_text);
	console.log('Request params: ', req.params);

  var meme = req.body;

  var img = req.body.new_img;
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  var filename = req.body.meme_name + '.png';
  var num = 0;

  createMemeImage(filename);

  function createMemeImage(filename) {
    // use fs.writeFile to save image on server under images dir
    fs.writeFile(__dirname + '/../public/images/' + filename, buf, {
      flag: 'wx'
    }, err => {
      if (err) {
        // If the filename already exists, increment a counter until an
        // available filename is found
        if (err.code === "EEXIST") {
          num++;
          console.log('Filename exists...creating new filename');
          filename = req.body.meme_name + "_" + num + ".png";
          createMemeImage(filename);
          return;
        } else {
          console.log('Error', err.code);
          return console.error(err);
        }
      }

      // Upload meme to Google Cloud Storage
      uploadFile(__dirname + '/../public/images/' + filename, filename);

      // Make sure the user exists
      User.findOne({
        where: {
          id: req.user.id
        }
      }).then(user => {

        // After the user's record has been found, associate the meme to the user
        Meme.create({
          meme_name: meme.meme_name,
          meme_text: meme.meme_text,
          og_img: meme.og_img,
          new_img: 'https://storage.googleapis.com/drymemes-4a96b.appspot.com/' + filename,
          tags: meme.tags,
          UserId: req.user.id
        }).then((success) => {
          console.log('Successfully added meme: ' + req.body.meme_name);

          // Returns a JSON object indicating the success(1) or failure(0) of the request
          res.json(success);

        }).catch((err) => {
          res.status(500).json(err.message).end();
        });
      }).catch(err => {
        res.status(500).json(err.message).end();
      });

      console.log('image has been created');
    });
  }

	// Upload a file to Google Cloud Storage
	const uploadFile = (filePath, filename) => {
        const bucketName = process.env.GC_BUCKET_ID;

		// Imports the Google Cloud client library
		const {Storage} = require('@google-cloud/storage');

		// Creates a client
		const storage = new Storage({ 
            projectId: process.env.GC_PROJECT_ID
        });

		// Uploads a local file to the bucket
        async function uploadFileToGC() {
            await storage.bucket(bucketName).upload(filePath, {
                destination: filename,
            });

            console.log(`${filePath} uploaded to ${bucketName}`);
        }
        uploadFileToGC().catch(console.error);
	}
}

exports.collection = function(req, res) {
	console.log('Inside Collection authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	// Returns only the current user's collection
  Meme.findAll({
    where: {
      UserId: req.user.id
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
    res.status(500).end();
  });
};

exports.collection_JSON = function(req, res) {
	console.log('Inside Collection JSON authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

  Meme.findAll({
    where: {
      UserId: req.params.userID
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
};

exports.deletePortfolio_JSON = function(req, res) {
	console.log('Inside Delete Portfolio authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	Portfolio.destroy({
		where: {
			id: req.body.portfolioID,
			userId: req.user.id
		}
	}).then((result) => {
		// Result with either be 1(successful) or 0(failed)
		Portfolio.findAll().then(portfolioList => {
			portfolios = [];
			for (var i = 0; i < portfolioList.length; i++) {
				portfolios.push(portfolioList[i].dataValues);
			}

			// Returns a JSON object of the remaining Portfolios
			res.json(portfolios);

		});
	}).catch((err) => {
		res.status(500).send(err.message);
	});
}

exports.search = function(req, res) {
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
    artworks = [];
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

      memes = [];
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
};

exports.savePortfolio_JSON = function(req, res) {
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
				UserId: req.user.id
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

exports.private_portfolio = function(req, res) {
	console.log('Inside Portfolio authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	Portfolio.findOne({
		where: {
			id: req.params.portfolioID,
			UserId: req.user.id
		},
		include: [
			{model: Meme}, 
			{model: User}
		],
	}).then((results) => {

		// Redirects the user to the Portfolio page and displays the selected portfolio
		res.render("portfolio", results.dataValues);

	}).catch((err) => {
		res.status(500).end();
	});
};

exports.public_portfolio = function(req, res) {
	console.log('Inside Portfolio authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	Portfolio.findOne({
		where: {
			id: req.params.portfolioID,
			UserId: req.params.userID
		},
		include: [
			{model: Meme}, 
			{model: User}
		],
	}).then((results) => {

		// Redirects the user to the Portfolio page and displays the selected portfolio
		res.render("portfolio", results.dataValues);

	}).catch((err) => {
		res.status(500).end();
	});
};

exports.addMemeToPortfolio_JSON = function(req, res) {
	console.log('Inside Add Meme to Portfolio authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	Meme.update({
		PortfolioId: req.body.portfolioID
	}, {
		where: {
			id: req.body.memeID,
			UserId: req.user.id
		}
	}).then((success) => {
		Portfolio.update({
			cover_img: req.body.cover_img
		}, {
			where: {
				id: req.body.portfolioID
			}
		}).then(result => {
			console.log('Successfully added meme to portfolio: ' + req.body.portfolioID);
			Portfolio.findAll().then(portfolioList => {
				portfolios = [];
				for (var i = 0; i < portfolioList.length; i++) {
					portfolios.push(portfolioList[i].dataValues);
				}

				// Returns a JSON object of all Portfolios
				res.json(portfolios);

			});
		}).catch((err) => {
			res.status(500).send('Error finding portfolio: ' + req.body.portfolioID).end();
		});
	}).catch((err) => {
		res.status(500).send('Error adding meme to portfolio: ' + req.body.portfolioID).end();
	});
}

exports.updatePortfolio_JSON = function(req, res) {
	console.log('Inside Update Portfolio authcontroller');
	console.log('Logged in user: ', req.user.id);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);

	Portfolio.update({
		portfolio_name: req.body.portfolio_name
	}, {
		where: {
			id: req.params.portfolioID,
			UserId: req.user.id
		}
	}).then(() => {
		console.log('Successfully updated portfolio: ' + req.params.portfolioID);
		Portfolio.findOne({
			where: {
				id: req.params.portfolioID
			}
		}).then((result) => {

			// Return a JSON object of the updated portfolio
			res.json(result.dataValues);

		}).catch((err) => {
			res.status(500).send('Error while fetching portfolio: ' + req.params.portfolioID).end();
		});
	}).catch((err) => {
		res.status(500).send('Error while updating portfolio: ' + req.params.portfolioID).end();
	});
}