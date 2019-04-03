# Technado
This project works with the PHP Wrapper [TwitterAPIExchange.php](https://github.com/j7mbo/twitter-api-php) by [James Mallison](https://www.j7mbo.com/) (J7mbo), and [Twitter Develper API](https://developer.twitter.com/content/developer-twitter/en.html). Shine css effect was made by Kieran Hunter https://kieranhunter.co.uk, and received from https://codepen.io/nidhinobinu/pen/RWaYGb. The lightning javascript was made by the user Nvagelis, and received from https://codepen.io/Nvagelis/pen/yaQGAL.

## Running (optional)
The keys required to run my website should be built in with the provided php files from class, and won’t need any modification.
However if you want to use your own credentials then follow the steps below:
1. First update credentials in get_tweets.php with keys and tokens from your user on the Twitter App
2. Run the project from a server

## Project info
This project was an assignment for New Media 3720: The Dynamic Web, offered at the University of Lethbridge, Alberta. The idea was to make an interactive design between twitter and graphics using the javascript canvas. 

When running tweets should automatically be pulled into the document, and any bulbs displayed on the screen can be clicked, if they are glwoing yellow then there is an unread tweet. This project can be a little CPU heavy since it is continously rendering lightning effects.

## Project documentation

For the Twitter API assignment my goal was to create a unique artistic way of displaying technology based tweets primarily through Javascript canvas. My idea was to create a randomized circuit board with little led bulbs to signify technology and computer related tweets. To do this I drew out a few rectangles and shaped them relative to a CPU shape and color. From there I drew out a series of bulbs that are connected with a gold wire to the CPU. These bulbs are gold and glowing when a unread/new tweet has been received as well as the wires that connect them are glowing. When clicking on the bulbs the bulb will turn red and lose its glow to the bulb and the wire, as well, modal window will be displayed which has a user, user’s handle, and tweet message in it. The modal window can be clicked which will open a new tab to the tweet’s direct link, however sometimes a tweet will have no link to it goes nowhere. In order to add a bit of aesthetic sugar the tweet windows have a shine effect, which can be difficult to spot, which is meant to be as its supposed to be subjective.

To add some more eye candy I found a premade lightning javascript file and repurposed it to fit my project and added in a lightning storm effect on the bulbs. The amount of lightning tendrils fully depends on the amount of retweets that particular tweet has received. The calculation is retweet count / 20, which is truncated to remove potential floating point problems. These little lightning storms will cycle forever until a newer tweet replaces the old tweet.

I am using the standard free version of the Twitter API from the Twitter Developer Platform at https://developer.twitter.com/content/developer-twitter/en.html. As well as I commandeered some css and javascript to enhance my project. The shine effect was made by Kieran Hunter https://kieranhunter.co.uk, and received from https://codepen.io/nidhinobinu/pen/RWaYGb. The lightning effect was made by the user Nvagelis, and received from https://codepen.io/Nvagelis/pen/yaQGAL.

