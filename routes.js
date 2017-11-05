const Accounts = require("./app/controllers/accounts");
const Tweets = require("./app/controllers/tweets");
const Assets = require("./app/controllers/assets");

module.exports = [
  { method: "GET", path: "/", config: Accounts.main },
  { method: "POST", path: "/register", config: Accounts.userRegister },
  { method: "POST", path: "/adduser", config: Accounts.addUser },
  { method: "GET", path: "/signup", config: Accounts.signup },
  { method: "GET", path: "/login", config: Accounts.login },
  { method: "POST", path: "/login", config: Accounts.authenticate },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/settings", config: Accounts.viewSettings },
  { method: "POST", path: "/settings", config: Accounts.updateSettings },

  { method: "GET", path: "/home", config: Tweets.home },
  { method: "POST", path: "/tweet", config: Tweets.tweet },
  { method: "GET", path: "/viewtimeline/{email}", config: Tweets.viewTimeline },
  { method: "GET", path: "/viewtimeline", config: Tweets.viewTimeline },
  { method: "GET", path: "/deleteuserstweets/{email}", config: Tweets.deleteUsersTweets },
  { method: "POST", path: "/deleteselectedtweets/{email}", config: Tweets.deleteSelectedTweets },


  { method: "GET", path: "/admin", config: Accounts.admin },
  { method: "GET", path: "/deleteuser/{email}", config: Tweets.deleteUser },

  {
    method: "GET",
    path: "/{param*}",
    config: { auth: false },
    handler: Assets.servePublicDirectory
  }
];
