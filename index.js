'use strict';

const Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

server.start(err => {
  if (err) {
    throw err;
  }

  console.log('Server listening at:', server.info.uri);
});