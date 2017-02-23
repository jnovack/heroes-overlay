module.exports = function(app, myApp, express){

    app.use('/cdn/jquery/', express.static(myApp.root + '/bower_components/jquery/dist/'));

    app.use('/cdn/bootstrap/', express.static(myApp.root + '/bower_components/bootstrap/dist/'));

    app.use('/cdn/font-awesome/css/', express.static(myApp.root + '/bower_components/font-awesome/css/'));
    app.use('/cdn/font-awesome/fonts/', express.static(myApp.root + '/bower_components/font-awesome/fonts/'));

    app.use('/cdn/animate/', express.static(myApp.root + '/bower_components/animate.css/'));

    app.use('/cdn/moment/', express.static(myApp.root + '/bower_components/moment/min/'));

    return;
};