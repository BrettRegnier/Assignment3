window.onload = function() {
    var prevListTweets = [];
    var curListTweets = [];

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	var circuit = new Circuit(300, 300, canvas);
	circuit.Draw();
	
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
        xhr.send(null);
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

                if (curListTweets.length != 0) {
                    tweets.forEach(function (tweet) {
                        var newTweet = true;

                        prevListTweets.forEach(function (oldTweet) {
                            if (tweet.id == oldTweet.id) {
                                newTweet = false;
                            }
                        });

                        if (newTweet) {
                            curListTweets.shift(tweet);
                            curListTweets.pop();
                        }
					});
                }
                else {
                    curListTweets = tweets;
                }

                prevListTweets = curListTweets;
 

                //  EXAMPLE OUTPUT TO A LIST
                var tweetList = "<ul>";
                prevListTweets.forEach(function (tweet) {
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