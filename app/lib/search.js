var twitter     = require('../services/twitter'),
    foursquare  = require('../services/foursquare'),
    utils       = require('./utils')
    querystring = require('querystring'),
    SparqlClient = require('sparql-client');

var search = {};

/**
*   Search places from location provided
*   @return Array of places object
*/
search.searchPlaces = function(query, count, source, callback){
  if(source == 'foursquare'){
    foursquare.Venues.search( query.x, query.y, null, { query: query.location_id, limit: count }, foursquare.access_token, function(err, data) {
      if(err) throw err;
      places = utils.pluckselect2( data.venues, ['id', 'name'], 'foursquare');
      callback(places);
    });
  } else if (source == 'twitter'){
      twitter.get('geo/search', { query: query.location_id, max_results: count }, function(err, data, response){
        if(err) throw err;
        places = utils.pluckselect2( data.result.places, ['id', 'full_name'], 'twitter');
        callback(places);
      });
  }
}

/**
*   Search tweet from next_result url
*   @return Array of tweets object
*/
search.searchTweetNextResult = function(url, callback){
    var options = querystring.parse(url.slice(1));
    twitter.get('search/tweets', options, function(err, data, response){
        db.storeTweets(data.statuses);
        callback(data);
    });
}
/**
*   Search users by using username provided
*   @return Array of users object
*/
search.searchUsers = function(username, count, callback){
  twitter.get('users/search', { q: username, count: count }, function(err, data, response){
    if(err) throw err;
    users = utils.pluckselect2( data, ['screen_name', 'screen_name'], 'twitter');
    users = users.map(function(obj){
      obj['text'] = '@'+obj['text'];
      return obj;
    });
    callback(users);
  });
}

search.getNearbyVenues=function(latitude,longitude,callback)
{
  var endpoint = 'http://dbpedia.org/sparql';
  var count =0;
  var finalArray = new Array()
  var arr = new Array();
  var foursquare_arr=new Array();
function allVenues(arr)
{
  count=count+1;
  //console.log("m in function"+count)
  //console.log(arr.length)
  finalArray=finalArray.concat(arr)
  if(count==3)
  {
    callback(finalArray);
  }
}
//var longitude=-73.983994
//var latitude=40.721294
  foursquare.Venues.search(latitude, longitude, null, { limit: 10 }, config.foursquare.access_token, function(error, venues) {
    if (!error) {
      venues.venues.forEach(function(venue){
        var Venue_obj = new Object();
        Venue_obj.name        = venue.name
        Venue_obj.photo       = ""
        Venue_obj.link        = "www.foursquare.com/v/"+venue.id
        Venue_obj.url         = venue.url
        Venue_obj.description = venue.name
        Venue_obj.address     = venue.location.formattedAddress
        Venue_obj.latitude    = venue.location.lat
        Venue_obj.longitude   = venue.location.lng
        Venue_obj.category    = (venue.categories.length > 0) ? venue.categories[0].name : "";
        Venue_obj.source      = 'foursquare';
        
        // Add venue to object array
        foursquare_arr.push(Venue_obj)
      });

      allVenues(foursquare_arr)
    }
  });
  var query='PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> SELECT ?subject ?label ?lat ?long ?isPrimaryTopicOf ?description ?address ?photo SAMPLE(?category) as ?category WHERE {?subject geo:lat ?lat.?subject geo:long ?long. ?subject rdfs:label ?label. ?subject foaf:isPrimaryTopicOf ?isPrimaryTopicOf. ?subject dbpedia-owl:abstract ?description. ?subject dbpprop:location ?address. ?subject dbpprop:hasPhotoCollection ?photo. ?subject dcterms:subject ?category. FILTER(xsd:double(?lat) -'+latitude+'<= 0.050).FILTER('+latitude+' - xsd:double(?lat) <= 0.05).FILTER(xsd:double(?long) - '+longitude+' <= 0.05).FILTER('+longitude+' - xsd:double(?long) <= 0.05 && lang(?label) = "en" ).} LIMIT 10'
  var client = new SparqlClient(endpoint);
//console.log("Query to " + endpoint);
//console.log("Query: " + query);
  client.query(query)

  .execute(function(error, results) 
  {  
    for (var indx in results)
    {
      for (var idx in results[indx].bindings)
      {
        var venues= new Object();
        venues.name=results[indx].bindings[idx].label.value
        venues.photo=results[indx].bindings[idx].photo.value
        venues.url=results[indx].bindings[idx].isPrimaryTopicOf.value
        venues.link=results[indx].bindings[idx].isPrimaryTopicOf.value
        venues.description=results[indx].bindings[idx].description.value
        venues.address=results[indx].bindings[idx].address.value
        venues.latitude=results[indx].bindings[idx].lat.value
        venues.longitude=results[indx].bindings[idx].long.value
        category=results[indx].bindings[idx].category.value.split(":",3)
        venues.category=category[2]
        venues.source = 'wikipedia';
        arr[idx]=venues
      }
      //console.log(results[indx].bindings[idx].label.value)
      //console.log(arr.length)
      //console.log("m here");
      //console.log("-----------------------------")
      //console.log("name: "+venues.name+"\n"+"photo:"+venues.photo+"\n"+"url: "+venues.url+"\n"+"description: "+venues.description+"\n"+"address: "+venues.address+"\n"+"category: "+venues.category+"\n"+"link:"+venues.link+"\n \n");
      arr[idx]=venues
      allVenues(arr)
    }
  //process.stdout.write(util.inspect(arguments, null, 5, true)+"\n");1
});

}

module.exports = search;
