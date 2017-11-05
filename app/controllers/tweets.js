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
    let LoggedInAdminEmail = request.auth.credentials.loggedInAdmin;

    let deletableTweets = true;

    if (userEmail == null) {
      userEmail = LoggedInUserEmail;
    } else if (userEmail != LoggedInUserEmail) {
      deletableTweets = false;
    }

    User.findOne({email: userEmail})
        .then(user => {

          Tweet.find({})
              .populate("tweeter")
              .then(allTweets => {
                for (let i = allTweets.length - 1; i >= 0; i--) {
                  if (allTweets[i].tweeter.email !== userEmail) {
                    allTweets.splice(i, 1)
                  }
                }
                if (LoggedInAdminEmail == null) {
                  reply.view("viewtimeline", {
                    title: "Timeline - " + user.firstName + " " + user.lastName,
                    tweets: allTweets,
                    tweetsDeletable: deletableTweets,
                    email: userEmail,
                  });
                } else {
                  reply.view("viewuser", {
                    title: "View User - " + user.firstName + " " + user.lastName,
                    tweets: allTweets,
                    tweetsDeletable: deletableTweets,
                    user: user,
                  });
                }
              });
        })
        .catch(err => {
          console.log(err);
          reply.redirect("/");
        });
  }
};

exports.deleteUsersTweets = {
  handler: function (request, reply) {
    let userEmail = request.params.email;

    User.findOne({email: userEmail})
        .then(user => {
          Tweet.remove({tweeter: user.id}).then(result => {
            reply.redirect("/viewtimeline/" + userEmail);
          });
        })
        .catch(err => {
          console.log(err);
          reply.redirect("/");
        });
  }
};

exports.deleteSelectedTweets = {
  handler: function (request, reply) {
    let userEmail = request.params.email;
    let chosenTweets = Object.keys(request.payload);

    for (let i = 0; i < chosenTweets.length; i++) {
      Tweet.remove({_id: chosenTweets[i]})
          .then(result => {
          })
          .catch(err => {
            console.log(err);
          });
    }
    reply.redirect("/viewtimeline/" + userEmail);
  }
};

exports.deleteUser = {
  handler: function (request, reply) {
    let userEmail = request.params.email;

    User.findOne({email: userEmail}).then(user => {
      Tweet.remove({tweeter: user.id})
          .then(result => {
            User.remove({email: userEmail})
                .then(result => {
                  reply.redirect("/admin");
                })
          })
    })
        .catch(err => {
          console.log(err);
        });
  }
};
