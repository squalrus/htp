var   azure = require( 'azure' )
    , async = require( 'async' )
    ;

module.exports = RatingList;

function RatingList( rating ){
    this.rating = rating;
}

RatingList.prototype = {

    showRatings: function( req, res ){
        self = this;

        var query = azure.TableQuery
            .select()
            .from( self.rating.tableName )
            .where( 'delete_date eq ?', 'false' );

        self.rating.find( query, function itemsFound( err, items ){
            res.render( 'ratings', { title: 'Page Title', ratings: items });
        });
    },

    addRating: function( req, res ){
        var self = this;

        var item = req.body.item;

        self.rating.addItem( item, function addItem( err ){
            if( err )
                throw err;
            res.redirect( '/' );
        });
    }
};