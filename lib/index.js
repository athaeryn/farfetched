"use strict";

var __fetch,
    handlers = [];


function farfetched(url, options) {
  var handler = makeHandler(url, options);
  // Array#push returns the length of the array, so we subtract 1 to get the
  // new handler's index.
  return handlers.push(handler) - 1;
}


function makeHandler(url, options) {
  return {
    url,
    response: options.response
  };
}


function handleRequest(url) {
  var handler = findHandler(url);
  return handler ? Promise.resolve(handler.response) : __fetch(url);
}


function findHandler(requestURL) {
  var matching = handlers.filter((h) => h.url === requestURL );
  return matching.length > 0 ? matching[0] : false;
}


farfetched.attach = function attach(global) {
  __fetch = global.fetch;
  global.fetch = handleRequest;
}


farfetched.clear = function clear(id) {
  delete handlers[id];
}


export default farfetched;
