var twitter    = require('../services/twitter'),
    connection = require('../services/db');
    db = require('./database');

var user = {};

/**
*   Get date of last X day provided
*   @return Date object
*/
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

/**
*   Get user tweets since last few days
*   @return Array of tweet object
*/
user.getUserTweetSince = function(username, days, count, callback){
  twitter.get('search/tweets', { q: 'from:' + username + ' since:' + this.getLastFewDaysDate(days), count: count }, function(err, data, response) {
    db.storeTweets(data.statuses);
    callback(data);
  });
}

/**
*   Get tweets posted at a place, within days limit
*   @return Array of tweets
*/
user.getVenueVisitors = function(params, count, callback){
  if(params.location){
    twitter.get('search/tweets', { q: 'place:' + params.location + ' since:' + this.getLastFewDaysDate(params.days_limit), count: count }, function(err, data, response) {
      db.storeTweets(data.statuses);
      callback(data);
    });
  } else if (params.latitude && params.longitude){
    twitter.get('search/tweets', { geocode: params.latitude + ',' + params.longitude + ',' + '15mi', q: ' since:' + this.getLastFewDaysDate(params.days_limit), count: 10 }, function(err, data, response) {
      db.storeTweets(data.statuses);
      callback(data);
    });
  }
}

/**
*   Get tweets of a user
*   @return Array of tweets
*/
user.getUserTweets = function(username, count, callback){
  twitter.get('statuses/user_timeline', { screen_name: username, count: count }, function(err, data, response){
    callback(data);
  });
}

/**
*   Get user from username provided
*   @return User object
*/
user.getUser = function(username, callback){
  twitter.get('users/show', { screen_name: username }, function(err, data, response){
    callback(data);
  });
}


/**
* Get keywords used by user
  @return array of user details and top x keywords
*/
user.getUserTopics= function(params,callback)
{

    var keywords=[]
    var freq_arr=[];
    var finalArray=[];
    var stopwords =[];
    var shim = require('es6-shim');
    var invIndex=new shim.Map();
   // var invIndex=new Map();
    
    var count =0;
    var count_callback=1;

    var users=params.username.split(",");
    var numKeywords=params.word_limit;
    var date=this.getLastFewDaysDate(params.days_limit);

    // read the list of stop words from database into the array stopwords
    connection.query('SELECT * FROM stopwords', function(err, rows)
    {
    for (words in rows)
        stopwords.push(rows[words].words);
        
    });

    //calculate total freuency of each keyword used from inverted index and store in the array "freq_arr"
    function termFrequency(invIndex)
    {
    count+=1;
    if (count==users.length)
    {

    invIndex.forEach(function(val,word){
        var total_freq=0;
        val.forEach(function(value){
            total_freq+=value
            
        });
        
        freq_arr.push({'word':word,'freq':total_freq});
    });

    // sorting the freq_array according to frequency        
    freq_arr.sort(function(a, b) 
        {
            return ((a.freq > b.freq) ? -1 : ((a.freq == b.freq) ? 0 : 1));
        });
    // choosing the most frequent x keywords as specified in input
    keywords=freq_arr.slice(0,numKeywords++);
    count_callback = 0;
    /** storing the data in "finalArray", sorted accordint to each user.
        * In finalArray usernames can be accessed by finalArray[i].User, profile informatoin of user as finalArray[i].data
        * information relating to keywords tracked by fialArray[i].words
    **/
    users.forEach(function(usr){
        user.getUser(usr,function(data)
        {
            // storing general information about user in database
            db.storeUser(data);
            var temp_ar=[];
            
            for (var j=0;j<keywords.length;j++)
            {
                if (invIndex.get(keywords[j].word).get(usr))
                {
                temp_ar.push({'word':keywords[j].word,'freq':invIndex.get(keywords[j].word).get(usr),'totalFreq':keywords[j].freq})
                db.storeKeywords(usr,keywords[j].word,keywords[j].freq,db.getKeywordID,db.storeUserKeyword);
                }
                else
                {
                   temp_ar.push({'word':keywords[j].word,'freq':0,'totalFreq':keywords[j].freq}) 

                }  
            }
            finalArray.push({'User':usr,'data':data,'words':temp_ar})
            count_callback++;
            if (count_callback==users.length)
            {
                callback(keywords,finalArray);
            }
        })
    });
     
}

}
// creating inverted index to track keywords
    for (usr in users)

     (function(usr) 
                    {   
                        twitter.get('search/tweets', { q:'from:'+users[usr],until:date},
                        function(error,data,res)
                        {
                            for (var indx in data.statuses) 
                            {
                                var words= data.statuses[indx].text.replace(/^\s+|\s+$/g, '').split(" ");

                                for (indx in words)
                                { 
                                    words[indx] = words[indx].replace(/[^\w\s+^{@#}]|_/g, "").toLowerCase();
                                    // removing stopwords from the tweets
                                    if (stopwords.indexOf(words[indx])==-1)
                                    {
                                    
                                    if(!invIndex.get(words[indx]))
                                    {
                                        var newMap = new Map();
                                        newMap.set(users[usr],1);
                                        invIndex.set(words[indx],newMap)
                                    }
                                    else
                                    {
                                        if(!invIndex.get(words[indx]).get(users[usr]))
                                        {
                                        invIndex.get(words[indx]).set(users[usr],1)
                                        }
                                        else
                                        {
                                            var freq=invIndex.get(words[indx]).get(users[usr])
                                            freq=freq+1
                                            invIndex.get(words[indx]).set(users[usr],freq)
                                            
                                        }
                                    }
                            }}
                        }(invIndex);
                       // calling the next function for further processing
                        termFrequency(invIndex);
                    })
            })(usr)

}

module.exports = user;
