module.exports = function(myApp){
    var debug = require('debug')('module:webserver');
    var webserver = {
            widgets: [],
            configurations: [],
            pages: [],
            pageData: [],
            io: {}
        },
        // passport = require('passport'),
        express = require('express'),
        pug = require("pug");

    webserver.initialize = function(){

        var app = express();
        app.use(express.static(__dirname + '/public'));         // set the static files location /public/js will be /js for users

        var logger = require('morgan');
        app.use(logger('dev'));                                 // log every request to the console

        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var session = require('express-session');
        var flash = require('connect-flash');

        app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));
        app.use(bodyParser.urlencoded({ extended: true }));     // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                             // parse application/json
        app.use(cookieParser('banana hammock'));
        app.use(flash());                                       // use connect-flash for flash messages stored in session

        var favicon = require('serve-favicon');
        app.use(favicon(__dirname + '/public/favicon.ico'));

        app.set('view engine', 'pug');
        app.set('views', __dirname + '/views');

        app.use(function(req, res, next){
            // Allow the pug templates access to myApp
            res.locals.myApp = myApp;
            next();
        });

        // Have to load this before app.router, otherwise, you cannot properly use passport middleware.
        // passport.serializeUser(function(user, done) {
        //     done(null, user);
        // });
        // passport.deserializeUser(function(user, done) {
        //     done(null, user);
        // });
        // app.use(passport.initialize());
        // app.use(passport.session());

        // Load other functions so pug can use them
        app.locals.moment = require("moment");

        // Router
        routes = require("./routes/")(app, myApp, express);

        // app.use extender for static bower content
        cdn = require("./routes/cdn.js")(app, myApp, express);

        // app.use('/users', users);
        // app.use('/admin', admin);
        app.use('/', routes);

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });

        var server = app.listen(myApp.config.PORT);
        debug("webserver started on port " + myApp.config.PORT);
        webserver.io = require('socket.io').listen(server);
        debug("socket.io started on port " + myApp.config.PORT);
        webserver.app = app;

    };

    myApp.webserver = webserver;
    debug("loaded...");
};
