/*
 * Routing
 * --------------------------------------------------------------- */

app.get( '/', ratingList.showRatings.bind( ratingList ) );

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

app.get( '/insert', function( req, res ){
    var tableService = azure.createTableService();

    // tableService.queryEntity( 'pissers', )
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