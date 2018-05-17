// Dependencies
var express = require("express");
var router = express.Router();
var fs = require("fs");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

var artworkCount;

// Require all models
var db = require("../models");

function displayThreeRandom(displayPage, model, res){
  artworkCount = 44809;
  model.findAll({
    where: {
      [Op.or]: [
        {id: parseInt(Math.floor(Math.random() * artworkCount))},
        {id: parseInt(Math.floor(Math.random() * artworkCount))},
        {id: parseInt(Math.floor(Math.random() * artworkCount))}
      ]
    }
  }).then((results) => {
    console.log(results);
    // generate a random offset
    var art = [];
    for (var i = 0; i < results.length; i++) {
      art.push(results[i].dataValues);
    }

    // Send results to index.handlebars
    res.render(displayPage, {artworks: art});
  }).catch((err) => {
      res.status(500).end();
  });
}

function displayOne(displayPage, model, modelId, res){
  model.findOne({
    where: {
      id: parseInt(modelId)
    }
  }).then((results) => {
    res.render(displayPage, results.dataValues);
  }).catch((err) => {
    res.status(500).end();
  });
}

function displayAll(displayPage, model, res){
  model.findAll().then((results) => {
    res.render(displayPage, results.dataValues);
  }).catch((err) => {
    res.status(500).end();
  });
}

// GET Routes
// ====================================================================

// Display the Index page -- GOOD
router.get("/", function(req, res) {
  displayThreeRandom("index", db.Artwork, res);
});

// Displays the Meme Editor page with a random img --RETIRE
// router.get("/meme-editor", function(req, res) {
//   artworkCount = artworkCount || 44809;
//   var randomID = Math.floor(Math.random() * artworkCount);
//   res.redirect("/meme-editor/" + randomID);
// });

// Displays the Meme Generator page with a random img --NEED TO USE
router.get("/create-meme", function(req, res) {
  artworkCount = artworkCount || 44809;
  var randomID = Math.floor(Math.random() * artworkCount);
  res.redirect("/create-meme/" + randomID);
});

// Displays the Meme Generator page -- GOOD (new)
router.get("/create-meme/:artworkID", function(req, res) {
  displayOne("new", db.Artwork, req.params.artworkID, res);
});

// Displays the Meme Editor page -- GOOD (new)
router.get("/edit-meme/:memeID", function(req, res) {
  displayOne("edit", db.Meme, req.params.memeID, res);
});

// Displays the Meme Editor page --- TODO: Retire this route
// router.get("/meme-editor/:memeID", function(req, res) {
//   // displayOne(db.Meme, req.params.memeID, res);
//   displayOne("editor", db.Artwork, req.params.memeID, res);
// });

// Displays the collection of all memes -- GOOD
router.get("/collection", function(req, res) {

  db.Meme.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(results => {

    // Retrieve meme data from results
    var memes = [];
    for (var i = 0; i < results.length; i++) {
      memes.push(results[i].dataValues);
    }
    res.render("collection", {
      memes: memes
    });
  }).catch(err => {
    res.status(500).end();
  });
});

// Search all Artworks and all Memes -- GOOD
// artwork.title, artwork.author , meme.meme_text, meme.meme_name
router.get("/search", function(req, res) {

  // Search for all Artwork that match the query
  db.Artwork.findAndCountAll({
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
    db.Meme.findAndCountAll({
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

      // Package & display the results of matched artwork and memes
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
});

// POST Routes
// ====================================================================

// User saves a meme (without a Portfolio)
router.post("/api/:userID/new-meme", function(req, res) {
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
          filename = req.body.meme_name + " (" + num + ").png";
          createMemeImage(filename);
          return;
        } else {
          console.log('Error', err.code);
          return console.error(err);
        }
      }

      // Make sure the user exists
      db.User.findOne({
        where: {
          id: parseInt(req.params.userID)
        }
      }).then(user => {

        // After the user's record has been found, associate the meme to the user
        db.Meme.create({
          meme_name: meme.meme_name,
          meme_text: meme.meme_text,
          og_img: meme.og_img,
          new_img: '/images/' + filename,
          tags: meme.tags,
          UserId: parseInt(req.params.userID)
        }).then((success) => {
          console.log('Successfully added meme: ' + req.body.meme_name);
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

});

// TODO: A user adds a new meme (with a Portfolio)
router.post("/api/:userID/:portfolioID/new-meme", function(req, res) {
  var meme = req.body;

  var img = req.body.new_img;
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  var filename = req.body.meme_name + '.png';
  var num = 0;

  createMemeImage(filename);

  function createMemeImage(filename) {
    // use fs.writeFile to save image on server under images dir
    // Allow files to be overrided
    fs.writeFile(__dirname + '/../public/images/' + filename, buf, {
      flag: 'wx'
    }, err => {
      if (err) {
        // If the filename already exists, increment a counter until an
        // available filename is found
        if (err.code === "EEXIST") {
          num++;
          console.log('Filename exists...creating new filename');
          filename = req.body.meme_name + " (" + num + ").png";
          createMemeImage(filename);
          return;
        } else {
          console.log('Error', err.code);
          return console.error(err);
        }
      }

      // Make sure the user exists
      db.User.findOne({
        where: {
          id: parseInt(req.params.userID)
        }
      }).then(user => {

        // After the user's record has been found, associate the meme to the user
        db.Meme.create({
          meme_name: meme.meme_name,
          meme_text: meme.meme_text,
          og_img: meme.og_img,
          new_img: '/images/' + filename,
          tags: meme.tags,
          UserId: parseInt(req.params.userID),
          PortfolioId: parseInt(req.params.portfolioID)
        }).then((success) => {
          console.log('Successfully added meme: ' + req.body.meme_name);
          res.json(success);
        }).catch((err) => {
          res.status(500).send('Error while adding meme: ' + req.body.meme_name).end();
        });
      }).catch(err => {
        res.status(500).json(err.message).end();
      });

      console.log('image has been created');
    });
  }

});


// PUT Routes
// ====================================================================

// A user updates a Meme
//take back to editor with same meme_text; delimit text data top/bottom
router.put("/api/:userID/update-meme/:memeID", function(req, res) {
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
          filename = req.body.meme_name + " (" + num + ").png";
          updateMemeImage(filename);
          return;
        } else {
          console.log('Error', err.code);
          return console.error(err);
        }
      }

      // Make sure the user exists
      db.User.findOne({
        where: {
          id: parseInt(req.params.userID)
        }
      }).then(user => {
        // After the user's record has been found, associate the meme to the user
        db.Meme.update({
          meme_name: meme.meme_name,
          meme_text: meme.meme_text,
          og_img: meme.og_img,
          new_img: '/images/' + filename,
          tags: meme.tags,
          // PortfolioId: parseInt(meme.portfolioID),
          UserId: parseInt(req.params.userID)
        }, {
          where: {
            UserId: parseInt(req.params.userID),
            id: parseInt(req.params.memeID)
          }
        }).then((success) => {
          console.log('Successfully updated meme: ' + req.body.meme_name);
          res.json(success);
          // res.redirect(200, "/");
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

});


// DELETE Routes
// ====================================================================

// Deletes a meme. The meme can only be delete if it belongs to 
// the specified user.
router.delete("/api/:userID/delete-meme/:memeID", function(req, res) {

  db.Meme.destroy({
    where: {
      userId: parseInt(req.params.userID),
      id: parseInt(req.params.memeID)
    }
  }).then((result) => {
    // Result with either be 1(successful) or 0(failed)
    res.json(result);
  }).catch((err) => {
    console.log('You cannot delete this meme');
    res.status(500).send(err.message);
  });
});

module.exports = router;
