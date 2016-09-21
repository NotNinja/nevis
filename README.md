      .oooooo.
     d8P'  `Y8b
    888      888  .ooooo.  oo.ooooo.   .oooo.o oooo    ooo
    888      888 d88' `88b  888' `88b d88(  "8  `88.  .8'
    888      888 888   888  888   888 `"Y88b.    `88..8'
    `88b    d88' 888   888  888   888 o.  )88b    `888'
     `Y8bood8P'  `Y8bod8P'  888bod8P' 8""888P'     .8'
                            888                .o..P'
                           o888o               `Y8P'

[Oopsy](https://github.com/Skelp/oopsy) makes it easier to use the Object-Orientated Programming (OOP) model in
JavaScript.

[![Build Status](https://img.shields.io/travis/Skelp/oopsy/develop.svg?style=flat-square)](https://travis-ci.org/Skelp/oopsy)
[![Dev Dependency Status](https://img.shields.io/david/dev/Skelp/oopsy.svg?style=flat-square)](https://david-dm.org/Skelp/oopsy#info=devDependencies)
[![License](https://img.shields.io/npm/l/oopsy.svg?style=flat-square)](https://github.com/Skelp/oopsy/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/oopsy.svg?style=flat-square)](https://www.npmjs.com/package/oopsy)

* [Install](#install)
* [API](#api)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

Install using the package manager for your desired environment(s):

``` bash
$ npm install --save oopsy
# OR:
$ bower install --save skelp-oopsy
```

You'll need to have at least [Node.js](https://nodejs.org) installed and you'll only need [Bower](https://bower.io) if
you want to install that way instead of using `npm`.

If you want to simply download the file to be used in the browser you can find them below:

* [Development Version](https://github.com/Skelp/oopsy/blob/master/dist/oopsy.js)
* [Production Version](https://github.com/Skelp/oopsy/blob/master/dist/oopsy.min.js)

## API

The API is extremely simple and is designed to make it as easy as possible to implement traditional inheritance.

``` javascript
Oopsy.extend([constructor][, prototype][, statics])
```

It is very flexible and can be used to extend *classes*:

``` javascript
var BaseObject = Oopsy.extend(function(options) {
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

All constructors extended by Oopsy are given a static `super_` property which references the super constructor. 

Also, this can be used to extend existing *classes* such as `EventEmitter`:

``` javascript
var EventEmitter = require('events').EventEmitter
var Oopsy = require('oopsy')

var BaseObject = Oopsy.extend(function() {
  EventEmitter.call(this)
}, EventEmitter.prototype, EventEmitter)
```

However, this last approach has the caveats of `instanceof` not identifying this kind of inheritance and `super_` will
only reference the constructor that is extended.

## Bugs

If you have any problems with Oopsy or would like to see changes currently in development you can do so
[here](https://github.com/Skelp/oopsy/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/Skelp/oopsy/blob/master/CONTRIBUTING.md). We want your suggestions and pull
requests!

A list of Oopsy contributors can be found in [AUTHORS.md](https://github.com/Skelp/oopsy/blob/master/AUTHORS.md).

## License

See [LICENSE.md](https://github.com/Skelp/oopsy/raw/master/LICENSE.md) for more information on our MIT license.

© 2016 [Skelp](https://skelp.io)
<img align="right" width="16" height="16" src="https://cdn.rawgit.com/Skelp/skelp-branding/master/assets/logo/base/skelp-logo-16x16.png">
