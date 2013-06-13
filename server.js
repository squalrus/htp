var express      = require( 'express' )
    ,http        = require( 'http' )
    ,path        = require( 'path' )
    ,htp         = require( './htp/htp-foursquare' )
    ,foursquare  = require( 'node-foursquare' )( htp.foursquareOpt )
    ,app         = express();

// Environment Settings
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

// Middleware
app.use( express.favicon() );
app.use( express.bodyParser() );
app.use( express.compress() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// Routing
app.get( '/', function( req, res ){
    res.render( 'index' );
});

app.get( '/login', function( req, res ){
    res.writeHead( 303, { 'location': foursquare.getAuthClientRedirectUrl() });
    res.end();
});

app.get( '/callback', function( req, res ){
    foursquare.getAccessToken({
        code: req.query.code
    }, function( error, accessToken ){
        if( error ){
            res.send( 'An error was thrown: ' + error.message );
        } else {
            // Save the accessToken and redirect
            res.render( 'index' );
        }
    });
});

// Create Server
http.createServer( app ).listen( app.get( 'port' ), function( ){
    console.log( 'Server listening on port ' + app.get( 'port' ) );
});