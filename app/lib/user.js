var twitter = require('./twitter');
var connection= require('./db');
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
*   Get tweets posted at a place, within days limit
*   @return Array of tweets
*/
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

user.getUserTopics= function(params,callback)
{

    var keywords=[]
    var invIndex=new Map();
    var freq_arr=[];
    var count =0;
    var finalArray=[];
    var stopwords =[]
    var count_callback=1;

    var users=params.username.split(",");
    var numKeywords=params.word_limit;
    var date=this.getLastFewDaysDate(params.days_limit);
    connection.query('SELECT * FROM stopwords', function(err, rows)
    {
    for (words in rows)
        stopwords.push(rows[words].words);
        
    });
    function termFrequency(invIndex)
{
    count+=1;
    if (count==users.length)
    {
    for (var key of invIndex.keys()) 
        {
            var total_freq=0;
            for (var value of invIndex.get(key).values())
                {
                    total_freq+=value
                }
            freq_arr.push({'word':key,'freq':total_freq});
        }        
    freq_arr.sort(function(a, b) 
        {
            return ((a.freq > b.freq) ? -1 : ((a.freq == b.freq) ? 0 : 1));
        });
        keywords=freq_arr.slice(0,numKeywords++);
    count_callback = 0;
    users.forEach(function(usr){
        user.getUser(usr,function(data)
        {
            var temp_ar=[];
            
            for (var j=0;j<keywords.length;j++)
            {
                
                console.log(data.screen_name);
                    console.log(keywords[j].word);
                if (invIndex.get(keywords[j].word).get(usr))
                {
                    console.log("in if")
                temp_ar.push({'word':keywords[j].word,'freq':invIndex.get(keywords[j].word).get(usr),'totalFreq':keywords[j].freq})
                }
                else
                {
                    console.log("in else");
                   temp_ar.push({'word':keywords[j].word,'freq':0,'totalFreq':keywords[j].freq}) 
                }
               
            }
            console.log("temp Arrat",temp_ar)
            finalArray.push({'User':data.screen_name,'data':data,'words':temp_ar})


            count_callback++;
            if (count_callback==users.length)
            {
                
                callback(keywords,finalArray);
            }
        })
    });
     
}

}

    for (usr in users)

     (function(usr) 
                    {   
                        twitter.get('search/tweets', { q:'from:'+users[usr],until:date},
                        function(error,data,res)
                        {
                            for (var indx in data.statuses) 
                            {
                                var words= data.statuses[indx].text.split(" ");
                                for (indx in words)
                                { 
                                    words[indx] = words[indx].replace(/[^\w\s]|_/g, "").toLowerCase();
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
                       
                        termFrequency(invIndex);
                    })
            })(usr)

}


module.exports = user;