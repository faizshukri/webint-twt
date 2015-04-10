/**
*   Google Place object
*/

var GooglePlaces = require("googleplaces");
var google_place = new GooglePlaces(config.app.google.api_key, config.app.google.place.format);

module.exports = google_place;