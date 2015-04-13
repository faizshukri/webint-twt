
var twitter = require('../services/twitter'),
    place   = require('./place'),
    user    = require('./user'),
    db      = require('./database'),
    utils   = require('./utils');

var socketio = {};

socketio.connection = function(socket){

    socket.on('start_stream_tweet', function(options){

        if(options.location){
            twitter.get('geo/id/:id', { id: options.location }, function(err, data, response){
                var x = [], y = [];
                data.bounding_box.coordinates[0].forEach(function(location){
                    x.push(location[0]),
                    y.push(location[1]);
                });

                x = utils.removeDuplicateValuesInArray(x);
                y = utils.removeDuplicateValuesInArray(y);

                emitPlaces(socket, [ x[0], y[0], x[1], y[1] ]);
            });
        } else if(options.coordinates) {
            options.coordinates = options.coordinates.split(',');
            emitPlaces(socket, [parseFloat(options.coordinates[1]) - 0.1, parseFloat(options.coordinates[0]) - 0.1, parseFloat(options.coordinates[1]) + 0.1, parseFloat(options.coordinates[0]) + 0.1]);
        }
    });

    socket.on('start_stream_place', function(options){

      user.getUser(options.username, function(user_obj){

        var place_stream = twitter.stream('statuses/filter', { follow: user_obj.id_str });

        place_stream.on('tweet', function(tweet) {

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

    var stream = twitter.stream('statuses/filter', { locations: coordinates });

    var user_ids = [];

    stream.on('tweet', function(tweet){

        db.storeTweets(tweet);
        
        // Prevent sending same user
        if( user_ids.indexOf(tweet.user.id) > -1 ) return;
        user_ids.push(tweet.user.id);
        socket.emit('show_tweet', tweet);
    });
}

module.exports = socketio;