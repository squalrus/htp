var express      = require( 'express' )
    ,http        = require( 'http' )
    ,path        = require( 'path' )
    ,htp         = require( './htp/htp-foursquare' )
    ,foursquare  = require( 'node-foursquare' )( htp.foursquareOpt )
    ,app         = express()
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

// Routing
app.get( '/', function( req, res ){
    res.render( 'index' );
});

app.get( '/list', function( req, res ){
    res.render( 'list' );
});

app.get( '/venues', function( req, res ){
    foursquare.Venues.explore( req.query.lat, req.query.lon, {}, req.session.token, function( error, result ){

        console.log( result );

        res.writeHead( 200, { 'Content-Type': 'text/json' });
        res.write( JSON.stringify( result ) );
        res.end('\n');
    });
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
            console.log( 'TOKEN: ' + accessToken );
            console.log( 'CODE:  ' + req.query.code );

            req.session.token = accessToken;

            res.redirect( '/list' );
        }
    });
});

// Create Server
http.createServer( app ).listen( app.get( 'port' ), function( ){
    console.log( 'Server listening on port ' + app.get( 'port' ) );
});