module.exports = function(app, myApp, express){

    var router = express.Router();

    checkShortId = function(req, res, next) {
        if (!myApp.utils.isShortId(req.params.id)) {
            res.render('error.pug', { message: "not a valid id", error: { status: 404 } } );
        } else {
            next();
        }
    };

    router.get('/', function(req, res, next) {
        res.render('index.pug', { version: myApp.package.version, showmodal: req.flash('showmodal')} );
    });

    router.get('/overlay/', function(req, res, next) {
        id = myApp.utils.shortid();
        req.flash('created', true);
        res.redirect('/overlay/'+id+'/admin' );
    });

    router.get('/overlay/:id', checkShortId, function(req, res, next) {
        res.render('overlay.pug', { id: req.params.id, title: "Heroes of the Storm Overlay" } );
    });

    router.get('/overlay/:id/admin', checkShortId, function(req, res, next) {
        res.render('overlay-admin.pug', { id: req.params.id, admin: true, title: 'Overylay Admin', created: req.flash('created') });
    });

    return router;
};