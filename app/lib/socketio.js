
var twitter = require('../services/twitter'),
    utils   = require('./utils');

var socketio = {};

socketio.connection = function(socket){

    socket.on('start_stream', function(location_id){

        twitter.get('geo/id/:id', { id: location_id }, function(err, data, response){

            var x = [], y = [];

            data.bounding_box.coordinates[0].forEach(function(location){
                x.push(location[0]),
                y.push(location[1]);
            });

            x = utils.removeDuplicateValuesInArray(x);
            y = utils.removeDuplicateValuesInArray(y);

            var stream = twitter.stream('statuses/filter', { locations: [ x[0], y[0], x[1], y[1] ] });

            var user_ids = [];

            stream.on('tweet', function(tweet){

                // Prevent sending same user
                if( user_ids.indexOf(tweet.user.id) > -1 ) return;
                user_ids.push(tweet.user.id);

                socket.emit('tweet', tweet);
            });
        });
    });

}

module.exports = socketio;