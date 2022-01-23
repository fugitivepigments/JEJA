module.exports = function(req, res) {
    console.log('Inside Logout authcontroller');
	console.log('Logged in user: ', req.user);
	console.log('SessionID: ', req.sessionID);
	console.log('Request body: ', req.body);
	console.log('Request params: ', req.params);
 
    req.session.destroy(function() {
 		// Redirect the user to the home page
        res.redirect('/');
    });
}