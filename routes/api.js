/*
 * API Routing
 * --------------------------------------------------------------- */

// Venues
// @description: List venues close to user
exports.venues = function( req, res ){

    // TODO: implement venue
    res.writeHead( 200, { 'Content-Type': 'text/json' });
    res.write( JSON.stringify({
         'success': 1
        ,'api': '/api/venue'
        ,'description': 'List venues close to user' })
    );
    res.end('\n');
}

// Venue Details
// @description: Venue details
exports.venue = function( req, res ){

    // TODO: implement venue
    res.writeHead( 200, { 'Content-Type': 'text/json' });
    res.write( JSON.stringify({
         'success': 1
        ,'api': '/api/venue/:id'
        ,'description': 'Venue details' })
    );
    res.end('\n');
}

// Rate Venue
// @description: Rate a venue
exports.rate = function( req, res ){

    // TODO: implement venue
    res.writeHead( 200, { 'Content-Type': 'text/json' });
    res.write( JSON.stringify({
         'success': 1
        ,'api': '/api/venue/:id'
        ,'description': 'Rate a venue' })
    );
    res.end('\n');
}