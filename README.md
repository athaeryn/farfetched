# farfetched

This is a simple library for mocking responses (like
[Mockjax](https://github.com/jakerella/jquery-mockjax)) for `window.fetch`.
I recommend using GitHub's [fetch polyfill](https://github.com/github/fetch).

I'm going to start simple and add methods and features as I need them or
they're requested.


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


## API

### farfetched(options)

Creates a handler and returns its ID.

Options:

- `url`

    The URL to match and mock.

- `response`

    The response object to return, or a function that returns it.


### farfetched.clear(id)

Clears the handler with the given ID.
