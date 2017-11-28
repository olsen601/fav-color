var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/secret');
});

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* Get signup page */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET Logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/*GET twitter auth*/
router.get('/auth/twitter', passport.authenticate('twitter'));

/* GET handle twitter reponse*/
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/secret',
  failureRedirect: '/'
}));

/* POST to login */
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/secret',
  failureRedirect: '/login',
  failureFlash: true
}));

/* POST to signup */
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/secret',
  failureRedirect: '/signup',
  failureFlash: true
}));

/* GET secret page. */
router.get('/secret', isLoggedIn, function(req, res, next) {

  res.render('secret', {
    username : req.user.local.username,
    twitterName: req.user.twitter.displayName,
    signupDate: req.user.signupDate,
    favorites: req.user.favorites
  });
});

/* POST to update secrets */
router.post('/saveSecrets', isLoggedIn, function(req, res, next){

  if (req.body.color || req.body.luckyNumber) {
    req.user.favorites.color = req.body.color || req.user.favorites.color;
    req.user.favorites.luckyNumber = req.body.luckyNumber || req.user.favorites.luckyNumber;

    //save modified user to db
    req.user.save()
    .then( () => {
      req.flash('updateMsg', 'Your data was updated');
      res.redirect('/secret');
    })
    .catch( (err) => {
      if (err.name === 'ValidationError') {
        req.flash('updateMsg', 'Your data is not valid');
        res.redirect('/secrets');
      } else {
        next(err);
      }
    });
  }
  else {
    req.flash('updateMsg', 'Please enter some data');
    res.redirect('/secret');
  }

})

//checks to see if the user is logged in, if not redirects to the login page
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
