var authController = require('../controllers/authcontroller.js');
var cors = require("cors");
 
module.exports = function(app, passport) {

    // GET Requests
    // ===============================================================
    
    app.get("/", authController.homePage);

    app.get('/community', authController.community);

    app.get('/search', authController.search);

    app.get('/create-meme', cors(), authController.createMemeFromRandom);

    app.get('/portfolios/:portfolioID', authController.private_portfolio);

    app.get('/users/:userID/portfolios/:portfolioID', authController.public_portfolio);

    app.get('/signup', authController.signupPage);

    app.get('/signin', authController.signinPage);

    app.get('/logout', authController.logout);

    app.get('/users/:userID', isLoggedIn, authController.user);

    app.get('/memes/:memeID', isLoggedIn, authController.editMeme); //Does not route properly

    app.get('/collection', isLoggedIn, authController.collection);

    app.get('/users/:userID/collection', isLoggedIn, authController.collection_JSON);

    app.get('/create-meme/:artworkID', authController.createMeme);

    // PUT Requests
    // ===============================================================

    app.put('/users/update-account', isLoggedIn, authController.updateUser_JSON);

    app.put('/memes/update-meme/', isLoggedIn, authController.updateMeme_JSON);

    app.put('/portfolios/update-portfolio', isLoggedIn, authController.updatePortfolio_JSON);

    app.put('/portfolios/add-meme', isLoggedIn, authController.addMemeToPortfolio_JSON);

    // POST Requests
    // ===============================================================

    app.post('/memes/save-meme', isLoggedIn, authController.saveMeme_JSON);

    app.post('/portfolios/save-portfolio', isLoggedIn, authController.savePortfolio_JSON);

    app.post('/signup', passport.authenticate('local-signup'), authController.createUser_JSON);

    app.post('/signin', passport.authenticate('local-signin'), authController.signinUser_JSON);

    // DELETE Requests
    // ===============================================================

    app.delete('/memes/delete-meme', isLoggedIn, authController.deleteMeme_JSON);

    app.delete('/portfolios/delete-portfolio', isLoggedIn, authController.deletePortfolio_JSON);

    app.delete('/users/delete-account', isLoggedIn, authController.deleteUser);

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/signin');
        }
    };
 
}