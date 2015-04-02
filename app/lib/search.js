var twitter = require('../lib/twitter');

var search = {};

search.getPlaces = function(location, count, callback){
    twitter.get('geo/search', { query: location, max_results: 10 }, function(err, data, response){
      if(err) throw err;
      callback(data);
    });
}

module.exports = search;