const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors')


// AUTH
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const passportConfiguration = require('./controllers/auth/passport.js');
const models = require('./models');
// INIT

const app = express();
// Auth setup

var allowedOrigins = ['http://localhost:8080'];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//app.use(cookie());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));;
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const RouteManager = require('./utils/routeManager');

// Controllers
// User Controller
const user_controller = require('./controllers/user');
const studio_controller = require('./controllers/studio');
const class_controller = require('./controllers/class');
const trainer_controller = require('./controllers/trainer');

// Auth Controller
const authController = require('./controllers/auth/auth');
const passportLocalController = require('./controllers/auth/passportLocal');
const passportInstagramController = require('./controllers/auth/instagram');
const passportFacebookController = require('./controllers/auth/facebook');
const authenticationManager = require('./utils/authenticationManager');

// TODO switch to development or production based on Env
const routeManager = new RouteManager();

// Routes Management
// Setup all the routes
routeManager.addRoute(app, 'get', '/users', user_controller.getUsers);
routeManager.addRoute(app, 'get', '/user/:id', user_controller.getUser);
routeManager.addRoute(app, 'get', '/user/:id/projects', user_controller.getUserProjects);
// Local auth routes
routeManager.addRoute(app, 'get', '/signup', authController.signup);
routeManager.addRoute(app, 'post', '/signup', passportLocalController.localSignUp);
routeManager.addRoute(app, 'get', '/signin/token', authController.signInToken);
routeManager.addRoute(app, 'get', '/signin', passportLocalController.localSignIn);
routeManager.addRoute(app, 'post', '/signin', passportLocalController.localSignIn);
routeManager.addRoute(app, 'get', '/dashboard', authController.isLoggedIn, authController.dashboard);
routeManager.addRoute(app, 'get', '/logout', authController.logout);


// Instagram auth routes
// GET /auth/instagram
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Instagram authentication will involve
//   redirecting the user to instagram.com.  After authorization, Instagram
//   will redirect the user back to this application at /auth/instagram/callback

routeManager.addRoute(app, 'get', '/auth/instagram', passportInstagramController.instagramSignUp);

// GET /auth/instagram/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.


routeManager.addRoute(app, 'get', '/auth/instagram/callback',
  passportInstagramController.instagramCallback,
  passportInstagramController.redirectAfterSignup);


// Facebook auth routes
// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to Facebook.com.  After authorization, Facebook
//   will redirect the user back to this application at /auth/facebook/callback

routeManager.addRoute(app, 'get', '/auth/facebook', passportFacebookController.facebookSignUp);

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

routeManager.addRoute(app, 'get', '/auth/facebook/callback',
  passportFacebookController.facebookCallback,
  passportFacebookController.redirectAfterSignup);

// Studio Routes
routeManager.addRoute(app, 'get', '/studios',
  authenticationManager.ensureAuthenticated,
  studio_controller.getStudios);
routeManager.addRoute(app, 'post', '/studio',
  authenticationManager.ensureAuthenticated,
  studio_controller.createStudio);
routeManager.addRoute(app, 'put', '/studio/:id',
  authenticationManager.ensureAuthenticated,
  studio_controller.editStudio);


routeManager.addRoute(app, 'get', '/studio/:id',
  studio_controller.getStudio);

// Classes routes
routeManager.addRoute(app, 'get', '/studio/:id/class',
  class_controller.getClasses);

routeManager.addRoute(app, 'post', '/class',
  authenticationManager.ensureAuthenticated,
  class_controller.createClass);

routeManager.addRoute(app, 'put', '/class/:id',
  authenticationManager.ensureAuthenticated,
  class_controller.editClass);

// Trainers Routes
routeManager.addRoute(app, 'get', '/studio/:id/trainer',
  trainer_controller.getTrainers);

routeManager.addRoute(app, 'post', '/trainer',
  authenticationManager.ensureAuthenticated,
  trainer_controller.createTrainer);

routeManager.addRoute(app, 'put', '/trainer/:id',
  authenticationManager.ensureAuthenticated,
  trainer_controller.editTrainer);

// debug all the register models and routes
routeManager.listRoutes();



// Inject user model on passport
passportConfiguration(passport, models.user.getDatabaseModel());



// Setup error handling
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Setup the Http(s) server for the app.
console.log(process.env.HTTP_PORT, process.env.HTTPS_PORT);
http.createServer(app).listen(process.env.HTTP_PORT);
https.createServer(app).listen(process.env.HTTPS_PORT);


module.exports = app;
