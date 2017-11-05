"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Joi = require("joi");


exports.home = {
  handler: function (request, reply) {
    Tweet.find({})
        .populate("tweeter")
        .then(allTweets => {
          reply.view("home", {
            title: "Timeline",
            tweets: allTweets,
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
          if (tweet.tweet.length > 140) {
            tweet.tweet = tweet.tweet.substring(0, 140);
          }
          tweet.tweeter = user.id;
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

exports.viewTimeline = {

  handler: function (request, reply) {
    let userEmail = request.params.email;
    let LoggedInUserEmail = request.auth.credentials.loggedInUser;

    let isLoggedInUser = true;

    if (userEmail != LoggedInUserEmail && userEmail != null) {
      isLoggedInUser = false;
    } else {
      userEmail = LoggedInUserEmail;
    }


    Tweet.find({})
        .populate("tweeter")
        .then(allTweets => {
          for (let i = allTweets.length - 1; i >= 0; i--) {
            if (allTweets[i].tweeter.email !== userEmail) {
              allTweets.splice(i, 1)
            }
          }
          let user = allTweets[0].tweeter;
          reply.view("viewtimeline", {
            title: "Timeline - " + user.firstName + " " + user.lastName,
            tweets: allTweets,
            isLoggedInUser: isLoggedInUser,
          });
        })
        .catch(err => {
          console.log(err);
          reply.redirect("/");
        });
  }
};
