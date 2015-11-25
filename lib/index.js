"use strict";

import Response from "./response";

var __fetch,
    handlers = [];


function farfetched(url, options) {
  var handler = makeHandler(url, options);
  // Array#push returns the length of the array, so we subtract 1 to get the
  // new handler's index.
  return handlers.push(handler) - 1;
}


function makeHandler(url, options) {
  var __response = options.response;

  return {
    url,
    respond: function(url) {
      return new Response(
        (typeof __response === "function")
        ? __response(url)
        : __response
      );
    }
  };
}


function handleRequest(url) {
  return new Promise(function(resolve) {
    var handler = findHandler(url);
    if (handler) {
      resolve(handler.respond(url));
    } else {
      resolve(__fetch(url));
    }
  });
}


function findHandler(requestURL) {
  var matching = handlers.filter(function(h) {
    if (typeof h.url === "string") {
      return h.url === requestURL;
    } else if (h.url.test !== void 0) {
      return h.url.test(requestURL)
    }
    return false;
  });
  return matching.length > 0 ? matching[0] : false;
}


farfetched.attach = function attach(global) {
  __fetch = global.fetch;
  global.fetch = handleRequest;
}

farfetched.detach = function detach(global) {
  global.fetch = __fetch;
}

farfetched.clear = function clear(id) {
  delete handlers[id];
}


export default farfetched;
