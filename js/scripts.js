window.onload = init;

function init() {

    var query;
    var input = document.getElementById("query");

    var prevListTweets = [];
    var curListTweets = [];
    var listTweets = [];




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
        xhr.open('GET', 'get_tweets.php', true); //this changes the state of xmlhttp
        xhr.send(null);
        xhr.onload = function () {
            // document.getElementById("results").innerHTML = xhr.responseText;
            if (xhr.status == 200) {

                var tmp = [];
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