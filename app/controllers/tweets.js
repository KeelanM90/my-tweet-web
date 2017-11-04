"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");

exports.home = {
  handler: function (request, reply) {
    Tweet.find({})
        .populate("tweeter")
        .then(allTweets => {
          reply.view("home", {
            title: "Timeline",
            tweets: allTweets
          });
        })
        .catch(err => {
          reply.redirect("/");
        });
  }
};

exports.tweet = {
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;

    let data = request.payload;
    const tweet = new Tweet(data);

    User.findOne({email: userEmail})
        .then(user => {
          if(tweet.tweet.length > 140) {
            tweet.tweet = tweet.tweet.substring(0,140);
          }
          tweet.tweeter = user._id;
          return tweet.save();
        })
        .then(newTweet => {
          reply.redirect("/home");
        })
        .catch(err => {
          reply.redirect("/");
        });
  }
};