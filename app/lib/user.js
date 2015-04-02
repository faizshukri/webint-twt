var twitter = require('./twitter');

var user = {};

user.getLastFewDaysDate = function(days){
    var today = new Date();
    var newDate = new Date(today.setDate(today.getDate()-days));
    var y = newDate.getFullYear(),
        m = newDate.getMonth() + 1,
        d = newDate.getDate();

    return y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

user.getInterestingVenues = function(){

}

user.getVenueVisitors = function(params, count, callback){
    if(params.location){
        twitter.get('search/tweets', { q: 'place:' + params.location + ' since:' + this.getLastFewDaysDate(params.days_limit), count: count }, function(err, data, response) {
          callback(data);
        });
    } else if (params.latitude && params.longitude){
        twitter.get('search/tweets', { geocode: params.latitude + ',' + params.longitude + ',' + '15mi', q: ' since:' + this.getLastFewDaysDate(params.days_limit), count: 10 }, function(err, data, response) {
          callback(data);
        });
    }
}

user.getUserTweets = function(username, count, callback){
    twitter.get('search/tweets', { q: 'from:' + username, count: count }, function(err, data, response){
        callback(data);
    });
}

user.getUser = function(username, callback){
    twitter.get('users/show', { screen_name: username }, function(err, data, response){
        callback(data);
    });
}

module.exports = user;