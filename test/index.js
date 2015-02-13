var assert = require("assert"),
    jsdom = require("mocha-jsdom"),
    farfetched = require("../lib");


describe("farfetched", function() {
  var self,
      handlerID;

  // Fake the DOM.
  jsdom();

  before(function() {
    self = window;
    // Stub out window.fetch.
    window.fetch = function(url) {
      return Promise.resolve("window.fetch");
    };
    farfetched.attach(window);
  });



  it("should create handlers", function(done) {
    handlerID = farfetched("/foo", { response: "foo" });
    window.fetch("/foo")
      .then(text)
      .then(function(response) {
        assert(response === "foo");
        done();
      })
      .catch(done);
  });


  it("should allow dynamic responses", function(done) {
    farfetched("/dynamic", {
      response: function(url) {
        return "dynamic response: " + url;
      }
    });
    window.fetch("/dynamic")
      .then(text)
      .then(function(response) {
        assert(response === "dynamic response: /dynamic");
        done();
      })
      .catch(done);
  });


  it("should allow regex URLs", function(done) {
    farfetched(/regex/, { response: "regex!" });
    window.fetch("/a-regex-filled-url")
      .then(text)
      .then(function(response) {
        assert(response === "regex!");
        done();
      })
      .catch(done);
  });


  it("should pass the requested URL to a handler function", function(done) {
    var requestURL = "/requestURL?foo=true";
    farfetched(/requestURL/, {
      response: function(url) { return url; }
    });
    window.fetch(requestURL)
      .then(text)
      .then(function(response) {
        assert(response === requestURL);
        done();
      })
      .catch(done);
  });


  it("should allow fetches to be mocked more than once", function(done) {
    var a, b;
    farfetched("/repeat", { response: "foo" });
    window.fetch("/repeat")
      .then(text)
      .then(function(text) { a = text; })
      .then(function() {
        return window.fetch("/repeat");
      })
      .then(text)
      .then(function(text) { b = text; })
      .then(function() {
        assert(a === b);
        done();
      })
      .catch(done);
  });


  it("should have a .json method on the response", function(done) {
    farfetched("/json", {
      response: { foo: "foo"}
    });

    window.fetch("/json")
      .then(json)
      .then(function(json) {
        assert(json.foo === "foo");
        done();
      })
      .catch(done);
  });


  it("shouldn't intercept requests that aren't mocked", function(done) {
    window.fetch("/bar").then(function(response) {
      ensureNoIntercept(response, done);
    });
  });


  describe(".attach", function() {
    it("should replace window.fetch", function() {
      assert(window.fetch.name === "handleRequest");
    });
  });


  describe(".clear", function() {
    it("should clear the handler", function(done) {
      farfetched.clear(handlerID);
      window.fetch("/foo").then(function(response) {
        ensureNoIntercept(response, done);
      });
    });
  });
});


function text(response) {
  return response.text();
}


function json(response) {
  return response.json();
}


function ensureNoIntercept(response, done) {
  var err;
  if (response !== "window.fetch") {
    err = new Error("farfetched intercepted a request it shouldn't have");
  }
  done(err);
}

