"use strict";

var _fetch,
    handlers = [];

function farfetched(...options) {
  var handler = makeHandler(options);
  return handlers.push(handler);
}


function makeHandler(options) {
  var { url, response } = options;
  console.log(url);
}


function handleRequest() {
}


farfetched.attach = function attach(global) {
  _fetch = global.fetch;
  global.fetch = handleRequest;
}


farfetched.clear = function clear(id) {
  delete handlers[id];
}
