var  express       = require( 'express' )
    ,http          = require( 'http' )
    ,path          = require( 'path' )
    ,azure         = require( 'azure' )
    ,nconf         = require( 'nconf' )
    ,htp           = require( './htp/htp-foursquare' )
    ,foursquare    = require( 'node-foursquare' )( htp.foursquareOptions )
    ,app           = express()
    ;

// Routing
var  routes        = require( './routes' )
     api           = require( './routes/api' )
    ;

nconf.env().file({ file: 'config.json' });

var  tableName     = nconf.get( 'TABLE_NAME' )
    ,partitionKey  = nconf.get( 'PARTITION_KEY' )
    ,accountName   = nconf.get( 'STORAGE_NAME' )
    ,accountKey    = nconf.get( 'STORAGE_KEY' )
    ;

// Environment Settings
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

// Middleware
app.use( express.favicon() );
app.use( express.bodyParser() );
app.use( express.compress() );
app.use( express.cookieParser() );
app.use( express.cookieSession({ key: 'pid', secret: 'pissr' }) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

/*
 * Page Routing
 * --------------------------------------------------------------- */
 // Index
app.get( '/', routes.index );
// List
app.get( '/list', routes.list );
// Venues
app.get( '/venues', routes.list );
// Login
app.get( '/login', routes.login );
// Insert
app.get( '/insert', function( req, res ){
    var tableService = azure.createTableService();

    // tableService.queryEntity( 'pissers', )
});
// Callback
app.get( '/callback', routes.callback );
// Callback
app.get( '/test', routes.test );

/*
 * API Routing
 * --------------------------------------------------------------- */
// Venues
app.get( '/api/venue', api.venues );

// Venue Details
app.get( '/api/venue/:id', api.venue );
app.post( '/api/venue/:id', api.rate );

// User Details
app.get( '/api/user/:id', api.user );

// Create Server
http.createServer( app ).listen( app.get( 'port' ), function( ){
    console.log( 'Server listening on port ' + app.get( 'port' ) );
});