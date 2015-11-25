# farfetched

This is a simple library for mocking responses (like
[Mockjax](https://github.com/jakerella/jquery-mockjax)) for `window.fetch`.
I recommend using GitHub's [fetch polyfill](https://github.com/github/fetch).

I'm going to start simple and add methods and features as I need them or
they're requested.

[![Build Status](https://img.shields.io/travis/athaeryn/farfetched.svg?style=flat-square)](https://travis-ci.org/athaeryn/farfetched)
[![npm](https://img.shields.io/npm/v/farfetched.svg?style=flat-square)](https://www.npmjs.com/package/farfetched)


## Installation

Farfetched is made to work with [Browserify](http://browserify.org/).
Install it:

```sh
$ npm install --save-dev farfetched
```

Then, require it in your project and attach it to `window`:

```js
var farfetched = require("farfetched");
farfetched.attach(window);
```


## Example

```js
// Call this once to enable farfetched.
farfetched.attach(window)

//
// A basic mocked response
//
farfetched('/the-answer', { response: '42' })

fetch('/the-answer')
  .then(log) // '42'


//
// Dynamic responses
//
farfetched(/\/food/, { response: url => url.split('?')[1] })

fetch('/food?apples')
  .then(log) // 'apples'


// Helper logging function.
function log (response) {
  response.text().then(res => console.log(res))
}
```


## API

### `farfetched(url, options)`

Creates a handler and returns its ID.

`url` is the URL (either a String or Regexp) to match and mock.

`options` is an object and can have the following properties:

- `response`

    The response to return or a function that can be called to obtain it.


### `farfetched.attach(window)`

Attaches farfetched to the global scope, replacing `window.fetch`.
`window.fetch` is still used when farfetched can't find a handler that matches
a route.

### `farfetched.detach(window)`

Detaches farfetched from the global scope and restores the original function.

### `farfetched.clear(id)`

Clears the handler with the given ID.
