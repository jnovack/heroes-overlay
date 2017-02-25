module.exports = function(app, myApp, express){

    var router = express.Router();

    checkHash = function(req, res, next) {
        if (!myApp.utils.isHash(req.params.hash)) {
            return res.render('error.pug', { message: "invalid id format", error: { status: 404 } } );
        }
        next();
    };

    checkSession = function(req, res, next) {
        myApp.storage.get(req.params.hash, function(err, json) {
            if (err) {
                return res.render('error.pug', { message: "invalid id", error: { status: 404 } } );
            }
            req.session.keys = myApp.utils.tryJSONParse(json);
            next();
        });
    };

    checkAdmin = function(req, res, next) {
        if (req.session.keys.admin !== req.session.admin) {
            return res.render('error.pug', { message: "not a valid admin session", error: { status: 404 } } );
        }
        next();
    };

    /******************/

    router.get('/', function(req, res, next) {
        var client = myApp.utils.uuid.v4();
        var admin = myApp.utils.uuid.v4();
        var hash = myApp.utils.createHash(client, admin);
        var keys = { client: client, admin: admin};

        myApp.storage.set(hash, JSON.stringify({ client: client, admin: admin}));
        req.session.keys = keys;
        req.session.admin = admin;

        res.render('overlay-admin.pug', { room: hash, title: 'Heroes of the Storm Overlay', key: req.session.keys.admin });
        // res.render('index.pug', { version: myApp.package.version, showmodal: req.flash('showmodal')} );
    });

    // router.get('/overlay/', function(req, res, next) {
    //     var client = myApp.utils.uuid.v4();
    //     var admin = myApp.utils.uuid.v4();
    //     var hash = myApp.utils.createHash(client, admin);
    //     var keys = { client: client, admin: admin};

    //     myApp.storage.set(hash, JSON.stringify({ client: client, admin: admin}));
    //     req.session.keys = keys;
    //     req.session.admin = admin;

    //     res.redirect('/overlay/'+hash+'/admin' );
    // });

    router.get('/:hash', checkHash, checkSession, function(req, res, next) {
        res.render('overlay.pug', { room: req.params.hash, title: "Heroes of the Storm Overlay", key: req.session.keys.client });
    });

    // router.get('/overlay/:hash/admin', checkHash, checkSession, checkAdmin, function(req, res, next) {
    //     res.render('overlay-admin.pug', { room: req.params.hash, title: 'Overylay Admin', key: req.session.keys.admin });
    // });

    return router;
};