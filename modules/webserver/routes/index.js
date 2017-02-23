module.exports = function(app, myApp, express){

    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.render('index.pug', { version: myApp.package.version, showmodal: req.flash('showmodal')} );
    });

    router.get('/modal', function(req, res, next) {
        req.flash('showmodal', true);
        res.redirect('/' );
    });

    return router;
};