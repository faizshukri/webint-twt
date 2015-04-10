var locations   = require('../services/google_place'),
    querystring = require("querystring"),
    https       = require('https'); 

var place = {};

place.getInterestingPlaces = function(name, callback){
  locations.textSearch({ query: name }, function(error, response) {

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

module.exports = place;