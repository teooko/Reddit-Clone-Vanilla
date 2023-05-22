#Reddit Clone in Vanilla JS

This practice project aims to recreate the home page of Reddit as of March 2023 in pure html, css and javascript. Also, check out my [other repository](https://github.com/teooko/Reddit-Clone-React) of the same page made in react. 

#Technical Details

There are 5 posts added to the feed each time the user scrolls to the bottom of the page. Each post request is used to set the subreddit name and picture, username and number of upvotes. There is an additional request for the comments total.

#Setting up

The page uses a social media mock api called [dummyapi.io](https://dummyapi.io/) and [Lorem Picsum](https://picsum.photos/) for subbreddit pictures. The key needs to be placed in a file named **config.js**, with the content `API_KEY = *your key*`. To start the project simply open index.html.