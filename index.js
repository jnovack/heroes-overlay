var myApp = { };
myApp.root = require('path').dirname(require.main.filename);
myApp.package = require(myApp.root+"/package.json");

// Load global event emitter
var events = require('events');
myApp.emitter = new events.EventEmitter();

require("./modules/utils")(myApp);

// Initialize myApp
myApp.utils.consoleOutput("line");
myApp.utils.consoleOutput(myApp.package.name + " v"+myApp.package.version, "Center", true);
myApp.utils.consoleOutput(myApp.package.author, "Center", true);
if(myApp.package.description !== undefined){
    myApp.utils.consoleOutput(myApp.package.description, "Center", true);
}
myApp.utils.consoleOutput("line");

// Start the initialization process
myApp.utils.consoleOutput("Initializing...");

// Save environment into a structure
myApp.config = process.env;

if (myApp.config.DEBUG === undefined) {
    myApp.utils.consoleOutput("DEBUG is OFF - To enable debugging, set the DEBUG environment variable.");
}
/***
 *  Initialize direct database access
 ***/
// require("../database/sqlite3")(myApp);
// myApp.database.initialize();


/***
 *  Initialize simple persistent storage
 ***/
// require("../storage/redis")(myApp);
require("./modules/storage/memory")(myApp);
myApp.storage.initialize();


/***
 *  Initialize the webserver
 ***/
require("./modules/webserver/")(myApp);
myApp.webserver.initialize();


/***
 *  Initialize the socket.io namespaces
 ***/
require("./modules/sockets/template")(myApp);
