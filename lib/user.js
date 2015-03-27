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

user.getVenueVisitors = function(venue, days, callback){
    twitter.get('search/tweets', { q: 'place:' + venue + ' since:' + this.getLastFewDaysDate(days), count: 10 }, function(err, data, response) {
      callback(data);
    });
}

user.getUserTweets = function(username, callback){
    twitter.get('search/tweets', { q: 'from:' + username }, function(err, data, response){
        callback(data);
    });
}

user.getUser = function(username, callback){
    twitter.get('users/show', { screen_name: username }, function(err, data, response){
        callback(data);
    });
}

module.exports = user;