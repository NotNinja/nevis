## Version 1.0.0, YYYY.MM.DD

* Rename library to Nevis (**breaking change**)
* Replace usage of ES2015 modules with CommonJS (**breaking change**)
* Add `Nevis#equals(obj)` instance method to check if instance is equal to another
* Add `Nevis#hashCode()` instance method to generate Java-like hash code for instance
* Add `Nevis#toString()` instance method to generate string representation for instance
* Add `Nevis.equals(value, other[, options])` static method to check whether two objects are equal
* Add `Nevis.hashCode(value[, options])` static method to generate Java-like hash code for an object
* Add `Nevis.toString(value[, options])` static method to generate string representation for instance
* Track code coverage in build

## Version 0.2.0, 2016.11.24

* Change source file to use ES6 module instead of CommonJS and add `jsnext:main` entry to `package.json`
* Publish source file with [npm](http://npmjs.com) package
* Switch to latest version of [ESLint](http://eslint.org)

## Version 0.1.1, 2016.09.21

* Change [Bower](https://bower.io) package name to `skelp-oopsy` to avoid conflict with existing package

## Version 0.1.0, 2016.09.21

* Initial release
