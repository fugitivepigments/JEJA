const { Op } = require("../utils");

module.exports = function(req, res) {
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