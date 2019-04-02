window.onload = function () {
    var _prevListTweets = [];
    var _curListTweets = [];

    var _tweetHolder = [];
    var _numTweets = 12;
    var _container = document.getElementById("container");

    var _canvas = document.getElementById("canvas");
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;

    var _circuit = new Circuit(_canvas.width, _canvas.height, _canvas);
    _circuit.Draw();

    var _curTweet;
    var _prevTweet;

    // HTML
    // todo add links
    // var tweet = document.createElement("div");
    // tweet.classList = "tweet";
    // tweet.id = "tweet";

    // var tweet_close = document.createElement("div");
    // tweet_close.classList = "tweet__close";
    // tweet.appendChild(tweet_close);

    // var tweet_link = document.createElement("a");
    // tweet_link.classList = "tweet__link shine";
    // tweet.appendChild(tweet_link);

    // var tweet_user = document.createElement("span");
    // tweet_user.classList = "tweet__user";
    // tweet_link.appendChild(tweet_user);

    // var tweet_name = document.createElement("span");
    // tweet_name.classList = "tweet__name";
    // tweet_user.appendChild(tweet_name);

    // var tweet_handle = document.createElement("span");
    // tweet_handle.classList = "tweet__handle";
    // tweet_user.appendChild(tweet_handle);

    // var tweet_message = document.createElement("span");
    // tweet_message.classList = "tweet__message";
    // tweet_link.appendChild(tweet_message);

    _canvas.addEventListener("click", function (e) {
        var pos = {
            x: e.clientX,
            y: e.clientY
        };

        var led = _circuit.Click(pos);
        if (led.id != -1) {
            _tweetHolder.forEach(holder => {
                if (holder.ledID == led.id) {
                    _prevTweet = _curTweet;
                    if (_prevTweet) _prevTweet.box.classList.toggle("tweet--active");

                    holder.box.classList.toggle("tweet--active");
                    holder.box.style.left = led.x + "px";
                    holder.box.style.top = led.y + "px";

                    _curTweet = holder;
                }
            });
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
        if (_tweetHolder.length == 0) {

            for (var i = 0; i < _numTweets; i++) {
                // HTML
                // todo add links
                var tweet = document.createElement("div");
                tweet.classList = "tweet";
                tweet.id = "tweet" + i;

                var tweet_close = document.createElement("div");
                tweet_close.classList = "tweet__close";
                tweet_close.innerText = "x";
                tweet_close.addEventListener("click", function () {
                    this.parentElement.classList.toggle("tweet--active");
                });
                tweet.appendChild(tweet_close);

                var tweet_link = document.createElement("a");
                tweet_link.classList = "tweet__link shine";
                tweet_link.setAttribute("target", "_blank");
                tweet.appendChild(tweet_link);

                var tweet_user = document.createElement("span");
                tweet_user.classList = "tweet__user";
                tweet_link.appendChild(tweet_user);

                var tweet_name = document.createElement("span");
                tweet_name.classList = "tweet__name";
                tweet_user.appendChild(tweet_name);

                var tweet_handle = document.createElement("span");
                tweet_handle.classList = "tweet__handle";
                tweet_user.appendChild(tweet_handle);

                var tweet_message = document.createElement("span");
                tweet_message.classList = "tweet__message";
                tweet_link.appendChild(tweet_message);

                _tweetHolder.push({ ledID: -1, box: tweet, link: tweet_link, username: tweet_name, handle: tweet_handle, msg: tweet_message });
                _container.appendChild(tweet);
            }
        }

        var xhr = new XMLHttpRequest();
        //this changes the state of xmlhttp
        xhr.open('GET', 'php/get_tweets.php?c=' + _numTweets, true);
        // xhr.send(null);
        xhr.onload = function () {
            // document.getElementById("results").innerHTML = xhr.responseText;
            if (xhr.status == 200) {

                var tmp = [];
                var newTweets = 0;
                var tweets = JSON.parse(xhr.responseText);
                tweets = tweets.statuses;
                tweets.forEach(function (tweet) {
                    if (tweet.retweeted_status == null) {
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
                            newTweets++;
                            _curListTweets.shift(tweet);
                            if (_curListTweets.length >= _numTweets)
                                _curListTweets.pop();
                        }
                    });
                }
                else {
                    _curListTweets = tweets;
                    for (var i = 0; i < tweets.length; i++) {
                        var url;
                        if (_curListTweets[i].entities.urls.length > 0)
                            url = _curListTweets[i].entities.urls[0].expanded_url;
                        else
                            url = _curListTweets[i].extended_entities.media[0].expanded_url

                        _tweetHolder[i].link.setAttribute("href", url);
                        _tweetHolder[i].username.innerText = _curListTweets[i].user.name;
                        _tweetHolder[i].handle.innerText = "@" + _curListTweets[i].user.screen_name;
                        _tweetHolder[i].msg.innerText = _curListTweets[i].text;
                        _tweetHolder[i].ledID = i;
                    }
                }

                if (newTweets > 0) {
                    var idx = _curListTweets.length - 1;
                    for (var i = 0; i <= newTweets; i++) {
                        var url;
                        if (_curListTweets[i].entities.urls.length > 0)
                            url = _curListTweets[i].entities.urls[0].expanded_url;
                        else
                            url = _curListTweets[i].extended_entities.media[0].expanded_url

                        if (_curListTweets.length >= _numTweets) {
                            _tweetHolder[idx - i].link.setAttribute("href", url);
                            _tweetHolder[idx - i].username.innerText = _curListTweets[i].user.name;
                            _tweetHolder[idx - i].handle.innerText = "@" + _curListTweets[i].user.screen_name;
                            _tweetHolder[idx - i].msg.innerText = _curListTweets[i].text;
                            _tweetHolder[idx - i].ledID = i;
                        }
                        else {
                            _tweetHolder[idx + 1 + i].link.setAttribute("href", url);
                            _tweetHolder[idx + 1 + i].username.innerText = _curListTweets[i].user.name;
                            _tweetHolder[idx + 1 + i].handle.innerText = "@" + _curListTweets[i].user.screen_name;
                            _tweetHolder[idx + 1 + i].msg.innerText = _curListTweets[i].text;
                            _tweetHolder[idx + 1 + i].ledID = idx + i;
                        }
                    }
                }

                _prevListTweets = _curListTweets;



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