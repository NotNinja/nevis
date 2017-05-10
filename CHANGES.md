## Version 0.5.0, 2017.05.10

* Link to source maps for development versions [#12](https://github.com/NotNinja/nevis/issues/12)
* Switch to Codecov for code coverage [#14](https://github.com/NotNinja/nevis/issues/14)
* Move to !ninja [#15](https://github.com/NotNinja/nevis/issues/15)

## Version 0.4.0, 2017.03.20

* Support es2015 maps [#7](https://github.com/NotNinja/nevis/issues/7)
* Support es2015 sets [#8](https://github.com/NotNinja/nevis/issues/8)
* Support es2015 typed arrays [#9](https://github.com/NotNinja/nevis/issues/9)
* Add new script for testing on CI [#10](https://github.com/NotNinja/nevis/issues/10)

## Version 0.3.0, 2017.03.18

* Rename library to Nevis (**breaking change**)
* Replace usage of ES6 modules with CommonJS (**breaking change**)
* Change `Nevis.extends` static method so that the class name (`class_`) can be passed as the first argument optionally
* Add `Nevis#equals(obj)` instance method to check if instance is equal to another
* Add `Nevis#hashCode()` instance method to generate Java-like hash code for instance
* Add `Nevis#toString()` instance method to generate string representation for instance
* Add `Nevis.equals(value, other[, options])` static method to check whether two objects are equal
* Add `Nevis.EqualsBuilder()` static constructor to check if complex classes are equal
* Add `Nevis.hashCode(value[, options])` static method to generate Java-like hash code for an object
* Add `Nevis.HashCodeBuilder([initial][, multiplier])` static constructor to generate Java-like hash codes for complex classes
* Add `Nevis.toString(value[, options])` static method to generate string representation for instance
* Release *lite* version where never only contains `Nevis****.extends` static method
* Track code coverage in build

## Version 0.2.0, 2016.11.24

* Change source file to use ES6 module instead of CommonJS and add `jsnext:main` entry to `package.json`
* Publish source file with [npm](http://npmjs.com) package
* Switch to latest version of [ESLint](http://eslint.org)

## Version 0.1.1, 2016.09.21

* Change [Bower](https://bower.io) package name to `skelp-oopsy` to avoid conflict with existing package

## Version 0.1.0, 2016.09.21

* Initial release
