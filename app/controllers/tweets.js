"use strict";
const Tweet = require("../models/tweet");

exports.home = {
  handler: function(request, reply) {
    Tweet.find({})
      .then(tweets => {
        reply.view("home", {
          title: "Create a tweet",
          tweets: tweets
        });
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};
