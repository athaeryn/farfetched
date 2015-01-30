var assert = require("assert"),
    jsdom = require("mocha-jsdom"),
    farfetched = require("../lib");


describe("farfetched", function() {
  var self,
      handlerID;

  jsdom();

  before(function() {
    self = window;
    window.fetch = function(url) {
      return Promise.resolve("window.fetch");
    }
    farfetched.attach(window);
  });



  it("should create handlers", function(done) {
    handlerID = farfetched("/foo", { response: "foo" });
    window.fetch("/foo").then(function(response) {
      assert(response === "foo");
      done();
    });
  });


  it("should let requests through with no matching handlers", function(done) {
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

function ensureNoIntercept(response, done) {
  var err;
  if (response !== "window.fetch") {
    err = new Error("farfetched intercepted a request it shouldn't have");
  }
  done(err);
}

