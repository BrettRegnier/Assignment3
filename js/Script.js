window.onload = function () {

	var _numTweets = 13;
	var _tweetRequest = 50;

	var _allPrevTweets = [];
	var _curListTweets = [];

	var _tweetHolder = [];
	var _container = document.getElementById("container");

	var _canvas = document.getElementById("canvas");
	_canvas.width = window.innerWidth;
	_canvas.height = window.innerHeight;

	var _circuit = new Circuit(_canvas.width, _canvas.height, _canvas, _numTweets);
	_circuit.Draw();

	var _curTweet;
	var _prevTweet;

	_canvas.addEventListener("click", function (e) {
		var pos = {
			x: e.clientX,
			y: e.clientY
		};

		var led = _circuit.Click(pos);
		if (led.id != -1)
		{
			_tweetHolder.forEach(holder => {
				if (holder.ledID == led.id)
				{
					_prevTweet = _curTweet;
					if (_prevTweet) _prevTweet.box.classList.toggle("tweet--active");

					holder.box.classList.toggle("tweet--active");
					holder.box.style.left = led.x + "px";
					holder.box.style.top = led.y + "px";

					_curTweet = holder;
					_circuit.Off(led.id);
					_circuit.Draw();
				}
			});
		}
	});

	function Sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function RefreshTweets() {
		while (true)
		{
			GetTweets();
			await Sleep(60000);
		}
	}

	function GetTweets() {
		if (_tweetHolder.length == 0)
		{

			for (var i = 0; i < _numTweets; i++)
			{
				var tweet = document.createElement("div");
				tweet.classList = "tweet";
				tweet.id = "tweet" + i;

				var tweet_close = document.createElement("div");
				tweet_close.classList = "tweet__close";
				tweet_close.innerText = "x";
				tweet_close.addEventListener("click", function () {
					if (this.parentElement == _curTweet.box)
						_curTweet = null;
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


				var holder = { ledID: -1, box: tweet, link: tweet_link, username: tweet_name, handle: tweet_handle, msg: tweet_message };

				_tweetHolder.push(holder);
				_container.appendChild(tweet);
			}
		}
		
		var xhr = new XMLHttpRequest();
		//this changes the state of xmlhttp
		xhr.open('GET', 'php/get_tweets.php?c=' + 50, true);
		xhr.send(null);
		xhr.onload = function () {
			if (xhr.status == 200)
			{
				var tmp = [];
				var newTweets = 0;
				var tweets = JSON.parse(xhr.responseText);
				tweets = tweets.statuses;
				tweets.forEach(function (tweet) {
					if (tweet.retweeted_status == null)
					{
						tmp.push(tweet);
					}
				});

				tweets = tmp;

				for (var i = 0; i < tweets.length; i++)
				{
					// while less than requested tweets
					if (newTweets < _numTweets)
					{
						var newTweet = true;
						if (_allPrevTweets)
							for (var j = 0; j < _allPrevTweets.length; j++)
								if (tweets[i].id == _allPrevTweets[j].id)
									newTweet = false;

						if (newTweet)
						{
							newTweets++;
							_curListTweets.unshift(tweets[i]);
							_allPrevTweets.unshift(tweets[i]);
							if (_curListTweets.length > _numTweets)
								_curListTweets.pop();
							if (_allPrevTweets.length > _tweetRequest)
								_allPrevTweets.pop();
						}
					}
				}

				if (newTweets > 0)
				{
					var idx = _curListTweets.length - 1;
					for (var i = 0; i < newTweets; i++)
					{
						var url = "";
						if (_curListTweets[i].entities.urls && _curListTweets[i].entities.urls.length > 0)
							url = _curListTweets[i].entities.urls[0].expanded_url;
						else if (_curListTweets[i].extended_entities)
							url = _curListTweets[i].extended_entities.media[0].expanded_url;

						if (_curListTweets.length < _numTweets)
						{
							_tweetHolder[idx + 1 + i].link.setAttribute("href", url);
							_tweetHolder[idx + 1 + i].username.innerText = _curListTweets[i].user.name;
							_tweetHolder[idx + 1 + i].handle.innerText = "@" + _curListTweets[i].user.screen_name;
							_tweetHolder[idx + 1 + i].msg.innerText = _curListTweets[i].text;
							_tweetHolder[idx + 1 + i].ledID = idx + i;
							_tweetHolder[idx + 1 + i].tweet = _curListTweets[i];
							_circuit.On(_tweetHolder[idx + 1 + i].ledID);
						}
						else
						{
							_tweetHolder[idx - i].link.setAttribute("href", url);
							_tweetHolder[idx - i].username.innerText = _curListTweets[i].user.name;
							_tweetHolder[idx - i].handle.innerText = "@" + _curListTweets[i].user.screen_name;
							_tweetHolder[idx - i].msg.innerText = _curListTweets[i].text;
							_tweetHolder[idx - i].ledID = i;
							_tweetHolder[idx - i].tweet = _curListTweets[i];
							_circuit.On(_tweetHolder[idx - i].ledID);
						}
					}
				}


				var lightningLeds = [];
				for (var i = 0; i < _tweetHolder.length; i++)
				{
					if (_tweetHolder[i].ledID >= 0)
					{
						var retweetThresh = Math.floor(_tweetHolder[i].tweet.retweet_count / 20);
						if (retweetThresh > 0)
							lightningLeds.push({ led: _circuit.leds[_tweetHolder[i].ledID], tendrils: retweetThresh } );
					}
				}
				
				LightningLeds(lightningLeds);
				_circuit.Draw();
			} else
			{
				console.log(xhr);
			}
		}
	}

	function Main() {
		RefreshTweets();
	}

	Main();
}