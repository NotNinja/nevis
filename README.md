    888b    888                   d8b
    8888b   888                   Y8P
    88888b  888
    888Y88b 888  .d88b.  888  888 888 .d8888b
    888 Y88b888 d8P  Y8b 888  888 888 88K
    888  Y88888 88888888 Y88  88P 888 "Y8888b.
    888   Y8888 Y8b.      Y8bd8P  888      X88
    888    Y888  "Y8888    Y88P   888  88888P'

[Nevis](https://github.com/Skelp/nevis) makes it easier to use the Object-Orientated Programming (OOP) model in
JavaScript.

[![Build Status](https://img.shields.io/travis/Skelp/nevis/develop.svg?style=flat-square)](https://travis-ci.org/Skelp/nevis)
[![Coverage](https://img.shields.io/coveralls/Skelp/nevis/develop.svg?style=flat-square)](https://coveralls.io/github/Skelp/nevis)
[![Dev Dependency Status](https://img.shields.io/david/dev/Skelp/nevis.svg?style=flat-square)](https://david-dm.org/Skelp/nevis#info=devDependencies)
[![License](https://img.shields.io/npm/l/nevis.svg?style=flat-square)](https://github.com/Skelp/nevis/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/nevis.svg?style=flat-square)](https://www.npmjs.com/package/nevis)

TODO: Add Oopsy upgrade notes

* [Install](#install)
* [API](#api)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

Install using the package manager for your desired environment(s):

``` bash
$ npm install --save nevis
# OR:
$ bower install --save nevis
```

You'll need to have at least [Node.js](https://nodejs.org). While equals should be compatible with all versions of
[Node.js](https://nodejs.org), it is only tested against version 4 and above.

If you want to simply download the file to be used in the browser you can find them below:

* [Development Version](https://github.com/Skelp/nevis/blob/master/dist/nevis.js)
* [Production Version](https://github.com/Skelp/nevis/blob/master/dist/nevis.min.js)

## API

TODO: Update API documentation

The API is extremely simple and is designed to make it as easy as possible to implement traditional inheritance.

``` javascript
Nevis.extend([constructor][, prototype][, statics])
```

It is very flexible and can be used to extend *classes*:

``` javascript
var BaseObject = Nevis.extend(function(options) {
  this.options = options || {}
})

var ChildObject = BaseObject.extend({
  getOption: function(name) {
    return this.options[name]
  },
  setOption: function(name, value) {
    this.options[name] = value
  }
})

var Person = ChildObject.extend(function(name, options) {
  Person.super_.call(this, options)

  this.name = name

  Person.people.push(this)
}, {
  greet: function(name) {
    return 'Hello ' + name + ', my name is ' + this.name
  }
}, {
  people: []
})
```

All constructors extended by Nevis are given a static `super_` property which references the super constructor. 

Also, this can be used to extend existing *classes* such as `EventEmitter`:

``` javascript
var EventEmitter = require('events').EventEmitter
var Nevis = require('nevis')

var BaseObject = Nevis.extend(function() {
  EventEmitter.call(this)
}, EventEmitter.prototype, EventEmitter)
```

However, this last approach has the caveats of `instanceof` not identifying this kind of inheritance and `super_` will
only reference the constructor that is extended.

## Bugs

If you have any problems with Nevis or would like to see changes currently in development you can do so
[here](https://github.com/Skelp/nevis/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/Skelp/nevis/blob/master/CONTRIBUTING.md). We want your suggestions and pull
requests!

A list of Nevis contributors can be found in [AUTHORS.md](https://github.com/Skelp/nevis/blob/master/AUTHORS.md).

## License

See [LICENSE.md](https://github.com/Skelp/nevis/raw/master/LICENSE.md) for more information on our MIT license.

[![Copyright Skelp](https://rawgit.com/Skelp/skelp-branding/master/assets/footer/invert-filled/skelp-footer-invert-filled.svg)](https://skelp.io)
