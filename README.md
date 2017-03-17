                                         888b    888                   d8b             .d88  88b.
                                         8888b   888                   Y8P            d88P"  "Y88b
                                         88888b  888                                 d88P      Y88b
    88888b.   .d88b.  888  888  888      888Y88b 888  .d88b.  888  888 888 .d8888b   888        888
    888 "88b d8P  Y8b 888  888  888      888 Y88b888 d8P  Y8b 888  888 888 88K       888        888
    888  888 88888888 888  888  888      888  Y88888 88888888 Y88  88P 888 "Y8888b.  Y88b      d88P
    888  888 Y8b.     Y88b 888 d88P      888   Y8888 Y8b.      Y8bd8P  888      X88   Y88b.  .d88P
    888  888  "Y8888   "Y8888888P"       888    Y888  "Y8888    Y88P   888  88888P'    "Y88  88P"

[Nevis](https://github.com/Skelp/nevis) brings more of the Object-Orientated Programming (OOP) model to JavaScript.

[![Build Status](https://img.shields.io/travis/Skelp/nevis/develop.svg?style=flat-square)](https://travis-ci.org/Skelp/nevis)
[![Coverage](https://img.shields.io/coveralls/Skelp/nevis/develop.svg?style=flat-square)](https://coveralls.io/github/Skelp/nevis)
[![Dev Dependency Status](https://img.shields.io/david/dev/Skelp/nevis.svg?style=flat-square)](https://david-dm.org/Skelp/nevis#info=devDependencies)
[![License](https://img.shields.io/npm/l/nevis.svg?style=flat-square)](https://github.com/Skelp/nevis/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/nevis.svg?style=flat-square)](https://www.npmjs.com/package/nevis)

* [Install](#install)
* [API](#api)
* [Migrating from Oopsy](#migrating-from-oopsy)
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

TODO: Document *lite* version

## API

TODO: Update API documentation

### Inheritance

TODO: Document inheritance 

The API is extremely simple and is designed to make it as easy as possible to implement traditional inheritance.

``` javascript
Nevis.extend([name][, constructor][, prototype][, statics])
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

All constructors extended by Nevis are given static properties `class_` and `super_` which are the name and reference
to the super constructor respectively. 

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

### Equality

Nevis adds a means of testing whether an object is equal to another that's more advanced than just `==` or `===`.

> Unavailable in *lite* version

``` javascript
Nevis.prototype.equals(obj)
```

Returns whether the instance is "equal to" the specified `obj`.

This method implements an equivalence relation on non-null object references:

* It is *reflexive*: for any non-null reference value `x`, `x.equals(x)` should return `true`.
* It is *symmetric*: for any non-null reference values `x` and `y`, `x.equals(y)` should return `true` if and only if
  `y.equals(x)` returns `true`.
* It is *transitive*: for any non-null reference values `x`, `y`, and `z`, if `x.equals(y)` returns `true` and
  `y.equals(z)` returns `true`, then `x.equals(z)` should return `true`.
* It is *consistent*: for any non-null reference values `x` and `y`, multiple invocations of `x.equals(y)` consistently
  return `true` or consistently return `false`, provided no information used in `equals` comparisons on the objects is
  modified.
* For any non-null reference value `x`, `x.equals(null)` should return `false`.

The default implementation of this method is the most discriminating possible equivalence relation on objects; that is,
for any non-null reference values `x` and `y`, this method returns `true` if, and only if, `x` and `y` are exactly equal
(`x === y` has the value `true`).

Please note that it is generally necessary to override the `Nevis.prototype.hashCode` method whenever this method is
overridden, so as to maintain the general contract for the `Nevis.prototype.hashCode` method, which states that equal
objects must have equal hash codes.

``` javascript
var Person = Nevis.extend('Person', function(name, age) {
  this.name = name
  this.age = age
}, {
  greet: function(name) {
    return 'Hello ' + name + ', my name is ' + this.name
  }
})
var bob = new Person('Bob', 58)
var suzie = new Person('Suzie', 30)

bob.equals(bob)
//=> true
bob.equals(new Person('Bob', 58))
//=> false
bob.equals(suzie)
//=> false
bob.equals(null)
//=> false
bob.equals(undefined)
//=> false
```

Continue reading for information on how to create a good equals for complex classes using `Nevis.EqualsBuilder`.

---

Nevis also provides a null-safe static method for testing the equality of two values of any type.

``` javascript
Nevis.equals(value, other[, options])
```

Returns whether the specified `value` is "equal to" the `other` provided using the given `options`.

Consequently, if both arguments are `null`, `true` is returned and if exactly one argument is `null`, `false` is
returned. Otherwise, this method implements an equivalence relation on non-null object references in the same way as
`Nevis.prototype.equals`.

If neither value is `null` and both are not exactly (strictly) equal, this method will first check whether `value` has a
method named "equals" and, if so, return the result of calling that method with `other` passed to it. If no "equals"
method exists on `value` or if the `ignoreEquals` option is enabled, it will attempt to test the equality internally
based on their type.

Plain objects are tested recursively for their properties and collections (e.g. arrays) are also tested recursively for
their elements.

The `options` parameter is entirely optional and supports the following:

| Option            | Type     | Default | Description                                                                                                                                                           |
| ----------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filterProperty`  | Function | N/A     | A function to be called to filter properties for objects to determine whether they should be tested. Not called for method properties when `ignoreMethods` is `true`. |
| `ignoreCase`      | Boolean  | `false` | Whether to ignore case when testing equality for strings.                                                                                                             |
| `ignoreEquals`    | Boolean  | `false` | Whether to ignore the `equals` method on `value`, when present                                                                                                        |
| `ignoreInherited` | Boolean  | `false` | Whether to ignore inherited properties when testing equality for objects.                                                                                             |
| `ignoreMethods`   | Boolean  | `false` | Whether to ignore method properties when testing equality for objects.                                                                                                |

``` javascript
var obj = {
  foo: 'bar',
  doSomething: function() {
    return 123
  }
}

Nevis.equals(obj, obj)
//=> true
Nevis.equals(obj, {
  foo: 'bar',
  doSomething: function() {
    return 321
  }
})
//=> false
Nevis.equals(obj, {
  foo: 'bar',
  doSomething: function() {
    return 321
  }
}, { ignoreMethods: true })
//=> true
Nevis.equals(bob, bob)
//=> true
Nevis.equals(bob, new Person('Bob', 58))
//=> false
Nevis.equals(bob, suzie)
//=> false
Nevis.equals('foo', 'foo')
//=> true
Nevis.equals('foo', 'FOO')
//=> false
Nevis.equals('foo', 'FOO', { ignoreCase: true })
//=> true
Nevis.equals(NaN, NaN)
//=> true
Nevis.equals(null, null)
//=> true
Nevis.equals(undefined, undefined)
//=> true
Nevis.equals(null, undefined)
//=> false
Nevis.equals(bob, null)
//=> false
Nevis.equals(bob, undefined)
//=> false
```

---

TODO: Document EqualsBuilder

### Hash Codes

Nevis introduces JavaScript to the Java concept of hash codes.

> Unavailable in *lite* version

``` javascript
Nevis.prototype.hashCode()
```

Returns the hash code for the instance. This method is supported for the benefit of hash tables.

The general contract of `hashCode` is: 

* Whenever it is invoked on the same instance more than once during an execution of an application, the `hashCode`
  method must consistently return the same number, provided no information used to generate the hash code on the
  instance is modified. This number need not remain consistent from one execution of an application to another execution
  of the same application.
* If two instances are equal, that calling the `hashCode` method on each of the two instances must produce the same
  number result.
* It is not required that if two instances are unequal, that calling the `hashCode` method on each of the two instances
  must produce distinct number results. However, the programmer should be aware that producing distinct number results
  for unequal instances may improve the performance of hash tables.
 
The default implementation of this method will attempt to generate the hash code based on all of the fields on the
instance. Please note that it is generally necessary to override the `Nevis.prototype.equals` method whenever this
method is overridden, so as to maintain the above contract where equal objects must have equal hash codes.

``` javascript
var Person = Nevis.extend('Person', function(name) {
  this.name = name
}, {
  greet: function(name) {
    return 'Hello ' + name + ', my name is ' + this.name
  }
})
var bob = new Person('Bob')
var suzie = new Person('Suzie')

bob.hashCode()
//=> 201348816
suzie.hashCode()
//=> 281655185
bob.hashCode() === new Person('Bob').hashCode()
//=> true
```

Continue reading for information on how to generate hash codes for complex classes using `Nevis.HashCodeBuilder`.

---

Nevis also provides a null-safe static method for generating a hash code for any value.

``` javascript
Nevis.hashCode(value[, options])
```

Returns a hash code for the specified `value` using the `options` provided. This method is supported for the benefit of
hash tables and it has the same general contract as `Nevis.prototype.hashCode`.
 
If `value` is `null`, this method will always return zero. Otherwise, it will check whether `value` has a method named
"hashCode" and, if so, return the result of calling that method. If no "hashCode" method exists on `value` or if the
`ignoreHashCode` option is enabled, it will attempt to generate the hash code internally based on its type.

Plain objects are hashed recursively for their properties and collections (e.g. arrays) are also hashed recursively for
their elements.

The `options` parameter is entirely optional and supports the following:

| Option            | Type     | Default | Description                                                                                                                                                             |
| ----------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowCache`      | Boolean  | `true`  | Whether to allow hash codes generated for certain immutable types to be cached for faster re-generation.                                                                |
| `filterProperty`  | Function | N/A     | A function to be called to filter properties for objects to determine whether they should be included. Not called for method properties when `ignoreMethods` is `true`. |
| `ignoreHashCode`  | Boolean  | `false` | Whether to ignore the `hashCode` method on `value`, when present                                                                                                        |
| `ignoreInherited` | Boolean  | `false` | Whether to ignore inherited properties when generating hash codes for objects.                                                                                          |
| `ignoreMethods`   | Boolean  | `false` | Whether to ignore method properties when generating hash codes for objects.                                                                                             |

``` javascript
var obj = {
  foo: 'bar',
  doSomething: function() {
    return 123
  }
}

Nevis.hashCode(obj)
//=> 688071817
Nevis.hashCode(obj, { ignoreMethods: true })
//=> 61653
Nevis.hashCode(bob)
//=> 201348816
Nevis.hashCode('foo')
//=> 101574
Nevis.hashCode(null)
//=> 0
Nevis.hashCode(undefined)
//=> 0
```

---

TODO: Document HashCodeBuilder

### String Representations

Nevis builds on top of JavaScript's `toString` method to make it easier to use.

> Unavailable in *lite* version

``` javascript
Nevis.prototype.toString()
```

Returns a string representation of the instance.

In general, this method returns a string that "textually represents" the instance. The result should be a concise but
informative representation that is easy for a person to read.

The default implementation of this method will return a string consisting of the instance's class name, the at-sign
character (`@`), and the hexadecimal representation of the hash code of the instance.

``` javascript
var RandomHolder = Nevis.extend('RandomHolder', function() {
  this.value = Math.random()
})
var random = new RandomHolder()

random.toString()
//=> "RandomHolder@d9f025a"
```

---

Nevis also provides a null-safe static method for getting string representations of any value.

``` javascript
Nevis.toString(value)
```

Returns the result of calling the `toString` method on the specified `value` when it is non-null.

If value is `null` or `undefined`, this method will return `"null"` or `"undefined"` respectively.

``` javascript
Nevis.toString(random)
//=> "RandomHolder@d9f025a"
Nevis.toString(123)
//=> "123"
Nevis.toString(null)
//=> "null"
Nevis.toString(undefined)
//=> "undefined"
```

## Migrating from Oopsy

If you've been using Oopsy (the former name for Nevis), then you should find migrating to Nevis really easy. All you
really need to do is find and replace "Oopsy" with "Nevis" and you'll have all of the old functionality and more.

If you don't want all of the additional functionality and only care about inheritance, you can use the *lite* version of
Nevis.

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
