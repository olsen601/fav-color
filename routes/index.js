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

/* POST to login */
router.post('/login', passport.authenticate('local-login', {
  succressRedirect: '/secret',
  failureRedirect: '/login',
  failureFlash: true
}));

/* POST to signup */
router.post('/signup', passport.authenticate('local-signup', {
  succressRedirect: '/secret',
  failureRedirect: '/signup',
  failureFlash: true
}));

/* GET secret page. */
router.get('/secret', isLoggedIn, function(req, res, next) {

  var user = req.user.local;

  res.render('secret', {
    username : user.username,
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
