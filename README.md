    888b    888                   d8b
    8888b   888                   Y8P
    88888b  888
    888Y88b 888  .d88b.  888  888 888 .d8888b
    888 Y88b888 d8P  Y8b 888  888 888 88K
    888  Y88888 88888888 Y88  88P 888 "Y8888b.
    888   Y8888 Y8b.      Y8bd8P  888      X88
    888    Y888  "Y8888    Y88P   888  88888P'

[Nevis](https://github.com/NotNinja/nevis) brings more of the Object-Orientated Programming (OOP) model to JavaScript.

[![Build Status](https://img.shields.io/travis/NotNinja/nevis/develop.svg?style=flat-square)](https://travis-ci.org/NotNinja/nevis)
[![Coverage](https://img.shields.io/codecov/c/github/NotNinja/nevis/develop.svg?style=flat-square)](https://codecov.io/gh/NotNinja/nevis)
[![Dev Dependency Status](https://img.shields.io/david/dev/NotNinja/nevis.svg?style=flat-square)](https://david-dm.org/NotNinja/nevis?type=dev)
[![License](https://img.shields.io/npm/l/nevis.svg?style=flat-square)](https://github.com/NotNinja/nevis/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/nevis.svg?style=flat-square)](https://www.npmjs.com/package/nevis)

* [Install](#install)
* [API](#api)
* [Why Nevis?](#why-nevis)
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

You'll need to have at least [Node.js](https://nodejs.org) and you'll only need [Bower](https://bower.io) if you want to
install that way instead of using `npm`. While equals should be compatible with all versions of
[Node.js](https://nodejs.org), it is only tested against version 4 and above.

If you want to simply download the file to be used in the browser you can find them below:

* [Development Version](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis.js) (81kb - [Source Map](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis.js.map))
* [Production Version](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis.min.js) (9.2kb - [Source Map](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis.min.js.map))

If you're only wanting support for inheritance, you can use the *lite* version instead:

* [Development Version - Lite](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis-lite.js) (7.5kb - [Source Map](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis-lite.js.map))
* [Production Version - Lite](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis-lite.min.js) (981b - [Source Map](https://cdn.rawgit.com/NotNinja/nevis/master/dist/nevis-lite.min.js.map))

## API

### Inheritance

Nevis' primary function is to provide clean implementation of single inheritance.

> Available in *lite* version

``` javascript
Nevis.extend([name][, constructor][, prototype][, statics])
```

Extends the constructor to which this method is associated with the `prototype` and/or `statics` provided.

If `name` is provided, it will be used as the class name and can be accessed via a special `class_` property on the
child constructor, otherwise the class name of the super constructor will be used instead. The class name may also be
used string representation for instances of the child constructor (via `toString`), but this is not applicable to the
*lite* version of Nevis.

If `constructor` is provided, it will be used as the constructor for the child, otherwise a simple constructor which
only calls the super constructor will be used instead.

The super constructor can be accessed via a special `super_` property on the child constructor.

It is very flexible and can be used to extend *classes*:

``` javascript
var Base = Nevis.extend('Base', function(attributes) {
  this.attributes = attributes || {};
}, {
  getAttribute: function(name) {
    return this.attributes[name];
  },
  setAttribute: function(name, value) {
    this.attributes[name] = value;
  }
});

var Person = Base.extend('Person', function(name, attributes) {
  Person.super_.call(this, attributes);

  this.name = name;

  Person.people.push(this);
}, {
  greet: function(name) {
    return 'Hello ' + name + ', my name is ' + this.name;
  }
}, {
  people: []
});

var bob = new Person('Bob', { age: 58 });

bob.name;
//=> "Bob"
bob.greet('Suzie');
//=> "Hello Suzie, my name is Bob"
bob.getAttribute('age');
//=> 58
Person.people;
//=> [ "Bob" ]
```

Also, this can be used to extend external classes such as `EventEmitter`:

``` javascript
var EventEmitter = require('events').EventEmitter;
var Nevis = require('nevis');

var Events = Nevis.extend('Events', function() {
  EventEmitter.call(this);
}, EventEmitter.prototype, EventEmitter);
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
  this.name = name;
  this.age = age;
}, {
  greet: function(name) {
    return 'Hello ' + name + ', my name is ' + this.name;
  }
});
var bob = new Person('Bob', 58);
var suzie = new Person('Suzie', 30);

bob.equals(bob);
//=> true
bob.equals(new Person('Bob', 58));
//=> false
bob.equals(suzie);
//=> false
bob.equals(null);
//=> false
bob.equals(undefined);
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
    return 123;
  }
};

Nevis.equals(obj, obj);
//=> true
Nevis.equals(obj, {
  foo: 'bar',
  doSomething: function() {
    return 321;
  }
});
//=> false
Nevis.equals(obj, {
  foo: 'bar',
  doSomething: function() {
    return 321;
  }
}, { ignoreMethods: true });
//=> true
Nevis.equals(bob, bob);
//=> true
Nevis.equals(bob, new Person('Bob', 58));
//=> false
Nevis.equals(bob, suzie);
//=> false
Nevis.equals('foo', 'foo');
//=> true
Nevis.equals('foo', 'FOO');
//=> false
Nevis.equals('foo', 'FOO', { ignoreCase: true });
//=> true
Nevis.equals(NaN, NaN);
//=> true
Nevis.equals(null, null);
//=> true
Nevis.equals(undefined, undefined);
//=> true
Nevis.equals(null, undefined);
//=> false
Nevis.equals(bob, null);
//=> false
Nevis.equals(bob, undefined);
//=> false
```

---

Nevis provides a builder to support creating good equals for complex classes.

> Unavailable in *lite* version

``` javascript
Nevis.EqualsBuilder()
```

The best way to describe it is by using an example that demonstrates it's API:

``` javascript
var Animal = Nevis.extend('Animal', function(species) {
  this.species = species;
}, {
  equals: function(obj) {
    if (obj == null) {
      return false;
    }

    return new Nevis.EqualsBuilder()
      .append(this.species, obj.species)
      .build();
  }
});
var Human = Nevis.extend('Human', function(name, age) {
  Human.super_.call(this, 'human');

  this.name = name;
  this.age = age;
}, {
  equals: function(obj) {
    if (obj == null) {
      return false;
    }

    return new Nevis.EqualsBuilder()
      .appendSuper(Human.super_.prototype.equals.call(this, obj))
      .append(this.name, obj.name)
      .append(this.age, obj.age)
      .build();
  }
});
var Lion = Nevis.extend('Lion', function(name, age) {
  Lion.super_.call(this, 'lion');

  this.name = name;
  this.age = age;
}, {
  equals: function(obj) {
    if (obj == null) {
      return false;
    }

    return new Nevis.EqualsBuilder()
      .appendSuper(Lion.super_.prototype.equals.call(this, obj))
      .append(this.name, obj.name)
      .append(this.age, obj.age)
      .build();
  }
});
var humanBob = new Human('Bob', 58);
var humanSuzie = new Human('Suzie', 30);
var lionBob = new Lion('Bob', 58);

humanBob.equals(humanBob);
//=> true
humanBob.equals(new Human('Bob', 58));
//=> true
humanBob.equals(lionBob);
//=> false
humanBob.equals(humanSuzie);
//=> false
humanSuzie.name = 'Bob';
humanSuzie.age = 58;
humanBob.equals(humanSuzie);
//=> true
humanBob.equals(null);
//=> false
humanBob.equals(undefined);
//=> false
```

When using `Nevis.EqualsBuilder` in an `equals` method, it's recommended to use `Nevis.HashCodeBuilder` in the
`hashCode` method on the same object.

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
  this.name = name;
}, {
  greet: function(name) {
    return 'Hello ' + name + ', my name is ' + this.name;
  }
});
var bob = new Person('Bob');
var suzie = new Person('Suzie');

bob.hashCode();
//=> -469006311
suzie.hashCode();
//=> -388699942
bob.hashCode() === new Person('Bob').hashCode();
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
    return 123;
  }
};

Nevis.hashCode(obj);
//=> 1343675198
Nevis.hashCode(obj, { ignoreMethods: true });
//=> 61653
Nevis.hashCode(bob);
//=> -469006311
Nevis.hashCode('foo');
//=> 101574
Nevis.hashCode(null);
//=> 0
Nevis.hashCode(undefined);
//=> 0
```

---

Nevis provides a builder to support generating hash codes for complex classes.

> Unavailable in *lite* version

``` javascript
Nevis.HashCodeBuilder([initial][, multipler])
```

Ideally the `initial` value and `multiplier` should be different for each class, however, this is not vital. Prime
numbers are preferred, especially for `multiplier`.

If specified, both `initial` and `multiplier` *must* be odd numbers.

The best way to describe it is by using an example that demonstrates it's API:

``` javascript
var Animal = Nevis.extend('Animal', function(species) {
  this.species = species;
}, {
  hashCode: function() {
    return new Nevis.HashCodeBuilder()
      .append(this.species)
      .build();
  }
});
var Human = Nevis.extend('Human', function(name, age) {
  Human.super_.call(this, 'human');

  this.name = name;
  this.age = age;
}, {
  hashCode: function() {
    return new Nevis.HashCodeBuilder()
      .appendSuper(Human.super_.prototype.hashCode.call(this))
      .append(this.name)
      .append(this.age)
      .build();
  }
});
var Lion = Nevis.extend('Lion', function(name, age) {
  Lion.super_.call(this, 'lion');

  this.name = name;
  this.age = age;
}, {
  hashCode: function() {
    return new Nevis.HashCodeBuilder()
      .appendSuper(Lion.super_.prototype.hashCode.call(this))
      .append(this.name)
      .append(this.age)
      .build();
  }
});
var humanBob = new Human('Bob', 58);
var humanSuzie = new Human('Suzie', 30);
var lionBob = new Lion('Bob', 58);

humanBob.hashCode();
//=> 1795252862788
humanBob.hashCode() === new Human('Bob', 58).hashCode();
//=> true
lionBob.hashCode();
//=> -79783715387
humanSuzie.hashCode();
//=> 1908159460360
humanSuzie.name = 'Bob';
humanSuzie.age = 58;
humanBob.hashCode() === humanSuzie.hashCode();
//=> true
```

When using `Nevis.HashCodeBuilder` in a `hashCode` method, it's recommended to use `Nevis.EqualsBuilder` in the `equals`
method on the same object.

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
  this.value = Math.random() * 100;
})
var random = new RandomHolder();

random.toString();
//=> "RandomHolder@f9fa743"

var UnnamedObject = Nevis.extend({
  foo: 'bar',
  fu: 'baz'
});
var unnamed = new UnnamedObject();

unnamed.toString();
//=> "Nevis@-3fff8d24"
```

---

Nevis also provides a null-safe static method for getting string representations of any value.

``` javascript
Nevis.toString(value)
```

Returns the result of calling the `toString` method on the specified `value` when it is non-null.

If value is `null` or `undefined`, this method will return `"null"` or `"undefined"` respectively.

``` javascript
Nevis.toString(random);
//=> "RandomHolder@f9fa743"
Nevis.toString(123);
//=> "123"
Nevis.toString(null);
//=> "null"
Nevis.toString(undefined);
//=> "undefined"
```

## Why Nevis?

Because we love Scotland and it is named after [Ben Nevis](https://en.wikipedia.org/wiki/Ben_Nevis) since we felt like
we conquered a mountain when creating this library.

## Migrating from Oopsy

If you've been using Oopsy (the former name for Nevis), then you should find migrating to Nevis really easy. All you
really need to do is find and replace "Oopsy" with "Nevis" and you'll have all of the old functionality and more.

If you don't want all of the additional functionality and only care about inheritance, you can use the *lite* version of
Nevis.

## Bugs

If you have any problems with Nevis or would like to see changes currently in development you can do so
[here](https://github.com/NotNinja/nevis/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/NotNinja/nevis/blob/master/CONTRIBUTING.md). We want your suggestions and pull
requests!

A list of Nevis contributors can be found in [AUTHORS.md](https://github.com/NotNinja/nevis/blob/master/AUTHORS.md).

## License

See [LICENSE.md](https://github.com/NotNinja/nevis/raw/master/LICENSE.md) for more information on our MIT license.

[![Copyright !ninja](https://cdn.rawgit.com/NotNinja/branding/master/assets/copyright/base/not-ninja-copyright-186x25.png)](https://not.ninja)
