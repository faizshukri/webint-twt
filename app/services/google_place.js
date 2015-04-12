/**
*   Google Place object
*/

var GooglePlaces = require("googleplaces");
var google_place = new GooglePlaces(config.google.api_key, config.google.place.format);

module.exports = google_place;