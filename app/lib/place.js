var locations   = require('../services/google_place'),
    utils       = require('./utils'),
    querystring = require('querystring'),
    entities    = require('entities');


var place = {};

place.getInterestingPlaces = function(name, callback){
  locations.textSearch({ query: name }, function(error, response) {

    if(response.status == 'ZERO_RESULTS' || response.status == 'OVER_QUERY_LIMIT'){
      callback({});
      return;
    }

    place.getPlaceDetails(response.results[0].place_id, function(result){

      result.photo_urls = [];
      if(typeof(result.photos) == 'undefined'){
        callback(result);
        return;
      }

      // Get maximum up to 3 photos only
      result.photos = result.photos.slice(0, 3);

      // Get the actual url for each photo
      result.photos.forEach(function(photo, index){
        place.getPlacePhoto(photo.photo_reference, function(url){
          result.photo_urls.push(url);

          // If all photo has been processed
          if(result.photo_urls.length == result.photos.length) callback(result);
        });
      });
    });
  });
}

place.getPlaceDetails = function(place_id, callback){
  locations.placeDetailsRequest({ placeid: place_id }, function (error, response) {
    if (error) throw error;
    callback(response.result);
  });
}

// Get photo not provided by googleplaces package. need to construct it manually
place.getPlacePhoto = function(photo_reference, callback){
  locations.imageFetch({ photoreference: photo_reference, maxwidth: 600 }, function(error, response){
    if (error) throw error;
    callback(response);
  });
}

/**
*   Reduce tweets that contain place only
*   @return Array of tweet object that contain place and unique
*/
place.filterPlaceName = function(tweets){

  tweets.forEach(function(tweet, index){

    // If the tweet come from foursquare, get the location from foursquare instead
    if( tweet.source.indexOf('Foursquare') != -1){

      // Get the place name from tweet
      var found = tweet.text.match(/I\'m at (.*) http|\(\@\ (.*)\)/);
      if(found)
        tweets[index].place_name = found.filter(function(n){ return n != undefined })[1].replace(/-\ \@(.*?)\ /, '');

    // If not, we get from twitter place
    } else if(tweet.place){
      tweets[index].place_name = tweet.place.full_name;
    }

    if(typeof(tweets[index].place_name) != 'undefined'){
      tweets[index].place_name       = entities.decodeHTML(tweets[index].place_name);
      tweets[index].place_name_query = querystring.escape(tweets[index].place_name);
    }
  });

  return utils.removeDuplicateObjectInArray(tweets, 'place_name');
}

module.exports = place;
