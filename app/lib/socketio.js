
var twitter     = require('../services/twitter'),
    place       = require('./place'),
    user        = require('./user'),
    db          = require('./database'),
    utils       = require('./utils');

var socketio = { stream: null };

socketio.connection = function(socket){

    socket.on('disconnect', function () {
        socketio.stream.stop();
    });

    socket.on('start_stream_tweet', function(options){
        if(options.location_id){

            // Get the place details from foursquare, to get it's location
            place.getFoursquarePlaceDetails(options.location_id, function(result){
                var location = result.venue.location;

                // Using it's location, we stream twitter from surrounding
                emitPlaces(socket, [ location.lng - 0.0003, location.lat - 0.0003, location.lng + 0.0003, location.lat + 0.0003 ]);
            });

        } else if(options.coordinates) {
            options.coordinates = options.coordinates.split(',');
            emitPlaces(socket, [parseFloat(options.coordinates[1]) - 0.0004, parseFloat(options.coordinates[0]) - 0.0004, parseFloat(options.coordinates[1]) + 0.0004, parseFloat(options.coordinates[0]) + 0.0004]);
        }
    });

    socket.on('start_stream_place', function(options){

      user.getUser(options.username, function(user_obj){

        socketio.stream = twitter.stream('statuses/filter', { follow: user_obj.id_str });

        socketio.stream.on('tweet', function(tweet) {

          // Proceed only if tweet has place
          var tweets  = place.filterPlaceName([tweet]);
          if(tweets.length > 0){
            tweet = tweets[0];

            db.storeTweets(tweet);

            place.getInterestingPlaces(tweet.place_name, function(data){

              // Assign photo to tweet data
              tweet.gplace = data;
              socket.emit('show_place', { tweet: tweet, api_key: config.google.api_key });
            });
          }
        });
      });
    });

}

function emitPlaces(socket, coordinates){

    socketio.stream = twitter.stream('statuses/filter', { locations: coordinates });

    var user_ids = [];

    socketio.stream.on('tweet', function(tweet){

        db.storeTweets(tweet);
        
        // Prevent sending same user
        if( user_ids.indexOf(tweet.user.id) > -1 ) return;
        user_ids.push(tweet.user.id);
        socket.emit('show_tweet', tweet);
    });
}

module.exports = socketio;