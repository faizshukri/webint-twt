
var twitter = require('../services/twitter'),
    utils   = require('./utils');

var socketio = {};

socketio.connection = function(socket){

    socket.on('start_stream', function(options){

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

}

function emitPlaces(socket, coordinates){

    var stream = twitter.stream('statuses/filter', { locations: coordinates });

    var user_ids = [];

    stream.on('tweet', function(tweet){

        // Prevent sending same user
        if( user_ids.indexOf(tweet.user.id) > -1 ) return;
        user_ids.push(tweet.user.id);

        socket.emit('tweet', tweet);
    });
}

module.exports = socketio;