<?php

	require_once('TwitterAPIExchange.php');
	 
	// Set access tokens: https://dev.twitter.com/apps/
	$settings = array(
	    'oauth_access_token' => "1110227370001104896-M70Uv6rNmHQAT5LoP7IGbzWnuGBG8O",
	    'oauth_access_token_secret' => "kk0XctyCAS6eR22QIxiEXSn6DTRQHW4u4sbJvKIphjquH",
	    'consumer_key' => "ZOI07gBnR5kFsOhhlz3zT61DW",
	    'consumer_secret' => "hCX4uSTT3fGTuhhiPRr7cqxIYWbeEWZ7OiH9lIOkUGccvYNs51"
	);
	
	$count = $_REQUEST["c"];

	// Choose URL and Request Method
	$url = "https://api.twitter.com/1.1/search/tweets.json";
	// $getfield = '?q=#tech+OR+technology+futurology:safe&lang=en'; // queries start with ? and are strung together with &
	$getfield = '?q=#puppies+filter:safe&lang=en&count=' . $count; // queries start with ? and are strung together with &
	$requestMethod = "GET";
	
	//Perform the request!
	$twitter = new TwitterAPIExchange($settings);
	echo $twitter->setGetfield($getfield)
	             ->buildOauth($url, $requestMethod)
	             ->performRequest();

?>

