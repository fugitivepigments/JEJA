//load bcrypt
var bCrypt = require('bcrypt-nodejs');
 
module.exports = function(passport, user) {

    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    var HerokuStrategy = require('passport-heroku').Strategy;

    var HEROKU_CLIENT_ID = process.env.HEROKU_CLIENT_ID;
    var HEROKU_CLIENT_SECRET = process.env.HEROKU_CLIENT_SECRET;
 
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user)
                {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else {
                    var userPassword = generateHash(password);
                    var data = {
                        email: email,
                        password: userPassword,
                        name: req.body.name
                    };
 
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }

                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    // passport.use(new HerokuStrategy(
    //     {
    //         clientID: HEROKU_CLIENT_ID,
    //         clientSecret: HEROKU_CLIENT_SECRET,
    //         callbackURL: "http://127.0.0.1:3000/auth/heroku/callback",
    //         // usernameField: 'email',
    //         // passwordField: 'password',
    //         // passReqToCallback: true // allows us to pass back the entire request to the callback
    //     },
    //     function(accessToken, refreshToken, profile, done){

    //     }
    //     function(req, email, password, done) {
    //         var generateHash = function(password) {
    //             return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    //         };
    //         User.findOne({
    //             where: {
    //                 email: email
    //             }
    //         }).then(function(user) {
    //             if (user)
    //             {
    //                 return done(null, false, {
    //                     message: 'That email is already taken'
    //                 });
    //             } else {
    //                 var userPassword = generateHash(password);
    //                 var data = {
    //                     email: email,
    //                     password: userPassword,
    //                     name: req.body.name
    //                 };
 
    //                 User.create(data).then(function(newUser, created) {
    //                     if (!newUser) {
    //                         return done(null, false);
    //                     }

    //                     if (newUser) {
    //                         return done(null, newUser);
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // ));

    //serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user 
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            var User = user;
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
     
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
     
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
     
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
     
                var userinfo = user.get();
                return done(null, userinfo);
     
            }).catch(function(err) {
                console.log("Error:", err);

                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));
}