/*
 * Routing
 * --------------------------------------------------------------- */

// Index
// @description: Basic information
exports.index = function( req, res ){
    res.render('index');
}

// List
// @description: List Venues
exports.list = function( req, res ){
    foursquare.Venues.explore( req.query.lat, req.query.lon, {}, req.session.token, function( error, result ){

        console.log( result );

        res.writeHead( 200, { 'Content-Type': 'text/json' });
        res.write( JSON.stringify( result ) );
        res.end('\n');
    });
}

// Login
// @description: Login
exports.login = function( req, res ){
    res.writeHead( 303, { 'location': foursquare.getAuthClientRedirectUrl() });
    res.end();
}

// Callback
// @description: Callback
exports.callback = function( req, res ){
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
}

exports.test = function( req, res ){
    res.render('test');
}