var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
 

    app.get('/community', authController.community);

    app.get('/collection',isLoggedIn, authController.collection);

    app.get('/users/:userID',isLoggedIn, authController.user);

    app.put('/users/update-account', isLoggedIn, authController.updateUser);

    app.put('/users/delete-account', isLoggedIn, authController.deleteUser);

    app.delete('/memes/delete-meme', isLoggedIn, authController.deleteMeme);

    app.get('/create-meme/:artworkID', authController.createMeme);

    app.post('/memes/edit-meme', isLoggedIn, authController.editMeme);

    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.get('/logout',authController.logout);

    app.post('/signup', passport.authenticate('local-signup'),
    	function(req, res){
    		// If sign up is successful send back json data
    		console.log('New signup successful for ', req.user.name);
    		console.log('Logged in user: ', req.user.id);
    		console.log('SessionID: ', req.sessionID);
    		res.json({
    			id: req.user.id, 
    			name: req.user.name,
    			session: req.sessionID
    		});
    	}
    );

	app.post('/signin', passport.authenticate('local-signin'),
		function(req, res) {
			// If sign in is successful send back json data
			console.log('Signin successful for ', req.user.name);
			console.log('Logged in user: ', req.user.id);
			console.log('SessionID: ', req.sessionID);
            // console.log(req);
            // res.redirect("/");
			res.json({
    			id: req.user.id, 
    			name: req.user.name,
    			session: req.sessionID
    		});
	    }
	);

	function isLoggedIn(req, res, next) {
	    if (req.isAuthenticated())
	        return next();
	         
	    res.redirect('/signin');
	};
 
}