window.onload = function() {
    var _prevListTweets = [];
    var _curListTweets = [];
    
    var _tweets = [];
    var _container = document.getElementById("container");

    var _canvas = document.getElementById("canvas");	
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
    
    var _circuit = new Circuit(1800, 900, _canvas);
    _circuit.Draw();

    // HTML
    var tweet = document.createElement("div");
    tweet.classList = "tweet";
    tweet.id = "tweet";
    
    var tweet_user = document.createElement("span");
    tweet_user.classList = "tweet__user";
    tweet.appendChild(tweet_user);
    
    var tweet_name = document.createElement("span");
    tweet_name.classList = "tweet__name";
    tweet_user.appendChild(tweet_name);
    
    var tweet_handle = document.createElement("span");
    tweet_handle.classList = "tweet__handle";
    tweet_user.appendChild(tweet_handle);
    
    var tweet_message = document.createElement("span");
    tweet_message.classList = "tweet__message";
    tweet.appendChild(tweet_message);
    
    _canvas.addEventListener("click", function(e) {
        var pos = {
            x: e.clientX,
            y: e.clientY
        };
        
        var id = _circuit.Click(pos);
        if (id != -1)
        {
            // create the html here?
        }
    });
	
    function Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function RefreshTweets() {
        while (true) {
            GetTweets();
            await Sleep(60000);
        }
    }

    function GetTweets() {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'php/get_tweets.php', true); //this changes the state of xmlhttp
        // xhr.send(null);
        xhr.onload = function () {
            // document.getElementById("results").innerHTML = xhr.responseText;
            if (xhr.status == 200) {

                var tmp = [];
                var newTweets = [];
                var tweets = JSON.parse(xhr.responseText);
                tweets = tweets.statuses;
                tweets.forEach(function (tweet) {
                    if (tweet.retweeted_status == null)
                    {
                        tmp.push(tweet);
                    }
                });

				tweets = tmp;

                if (_curListTweets.length != 0) {
                    tweets.forEach(function (tweet) {
                        var newTweet = true;

                        _prevListTweets.forEach(function (oldTweet) {
                            if (tweet.id == oldTweet.id) {
                                newTweet = false;
                            }
                        });

                        if (newTweet) {
                            _curListTweets.shift(tweet);
                            _curListTweets.pop();
                        }
					});
                }
                else {
                    _curListTweets = tweets;
                }

                _prevListTweets = _curListTweets;
 

                //  EXAMPLE OUTPUT TO A LIST
                var tweetList = "<ul>";
                _prevListTweets.forEach(function (tweet) {
                    tweetList += "<li>" + tweet.text + "</li>";
                });
                tweetList += "</ul>"

                document.getElementById("results").innerHTML = tweetList;


            } else {
                console.log(xhr);
            }
        }
    }

    function Main() {
        RefreshTweets();
    }

    Main();
}