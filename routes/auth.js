var controllers = require('../controllers/controllers.js');
var cors = require("cors");
 
module.exports = function(app, passport) {

    // Page Routes
    // ===============================================================
    
    app.get("/", controllers.goto_homePage);

    app.get('/search', controllers.goto_searchResults);
    
    app.get('/community', controllers.goto_communityPage);

    app.get('/collection', isLoggedIn, controllers.goto_collectionPage);

    app.get('/signup', controllers.goto_signupPage);
    
    app.get('/signin', controllers.goto_signinPage);
    
    // User Routes
    // ===============================================================
    
    app.get('/users/:userID', isLoggedIn, controllers.action_restrictUserToOwnProfile);
    
    app.post('/signup', passport.authenticate('local-signup'), controllers.action_createUser);
    
    app.post('/signin', passport.authenticate('local-signin'), controllers.action_signinUser);
    
    app.get('/logout', controllers.action_logoutUser);
    
    app.put('/users/update-account', isLoggedIn, controllers.action_updateUser);
    
    app.delete('/users/delete-account', isLoggedIn, controllers.action_deleteUser);
    
    app.get('/users/:userID/collection', isLoggedIn, controllers.action_getUsersMemeCollection);
    
    // Meme Routes
    // ===============================================================
    
    app.get('/create-meme/:artworkID', controllers.goto_createMemePage);
    
    app.get('/create-meme', cors(), controllers.goto_createRandomMemePage);
    
    app.get('/view-meme/:memeID', isLoggedIn, controllers.goto_displayMemePage);

    app.get('/edit-meme/:memeID', isLoggedIn, controllers.goto_editMemePage);
    
    app.post('/memes/save-meme', isLoggedIn, controllers.action_saveMeme);
    
    app.put('/memes/update-meme/', isLoggedIn, controllers.action_updateMeme);
    
    app.delete('/memes/delete-meme', isLoggedIn, controllers.action_deleteMeme);
    
    // Portfolio Routes
    // ===============================================================
    
    app.get('/portfolios/:portfolioID', controllers.goto_publicPortfolio);
    
    app.get('/users/:userID/portfolios/:portfolioID', controllers.goto_privatePortfolio);
    
    app.put('/portfolios/add-meme', isLoggedIn, controllers.action_addMemeToPortfolio);
    
    app.post('/portfolios/save-portfolio', isLoggedIn, controllers.action_savePortfolio);
    
    app.put('/portfolios/update-portfolio', isLoggedIn, controllers.action_updatePortfolio);
    
    app.delete('/portfolios/delete-portfolio', isLoggedIn, controllers.action_deletePortfolio);
    
    // Misc
    // ===============================================================

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/signin');
        }
    };
 
}