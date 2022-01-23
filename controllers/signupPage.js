const { Op } = require("./utils");

module.exports = function(req, res) {
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
}