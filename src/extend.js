/*
 * Copyright (C) 2017 Alasdair Mercer, !ninja
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

/**
 * A bare-bones constructor for surrogate prototype swapping.
 *
 * @private
 * @constructor
 */
var Constructor = /* istanbul ignore next */ function() {};
/**
 * A reference to <code>Object.prototype.hasOwnProperty</code>.
 *
 * @private
 * @type {Function}
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * A reference to <code>Array.prototype.slice</code>.
 *
 * @private
 * @type {Function}
 */
var slice = Array.prototype.slice;

/**
 * Creates an object which inherits the given <code>prototype</code>.
 *
 * Optionally, the created object can be extended further with the specified <code>properties</code>.
 *
 * @param {Object} prototype - the prototype to be inherited by the created object
 * @param {Object} [properties] - the optional properties to be extended by the created object
 * @return {Object} The newly created object.
 * @private
 */
function createObject(prototype, properties) {
  var result;
  /* istanbul ignore next */
  if (typeof Object.create === 'function') {
    result = Object.create(prototype);
  } else {
    Constructor.prototype = prototype;
    result = new Constructor();
    Constructor.prototype = null;
  }

  if (properties) {
    extendObject(true, result, properties);
  }

  return result;
}

/**
 * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
 * <code>statics</code> provided.
 *
 * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
 * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
 * instead. The class name may also be used string representation for instances of the child constructor (via
 * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
 *
 * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
 * constructor which only calls the super constructor will be used instead.
 *
 * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
 *
 * @param {string} [name=this.class_] - the class name to be used for the child constructor
 * @param {Function} [constructor] - the constructor for the child
 * @param {Object} [prototype] - the prototype properties to be defined for the child
 * @param {Object} [statics] - the static properties to be defined for the child
 * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
 * @public
 */
function extend(name, constructor, prototype, statics) {
  var superConstructor = this;

  if (typeof name !== 'string') {
    statics = prototype;
    prototype = constructor;
    constructor = name;
    name = null;
  }

  if (typeof constructor !== 'function') {
    statics = prototype;
    prototype = constructor;
    constructor = function() {
      return superConstructor.apply(this, arguments);
    };
  }

  extendObject(false, constructor, superConstructor, statics);

  constructor.prototype = createObject(superConstructor.prototype, prototype);
  constructor.prototype.constructor = constructor;

  constructor.class_ = name || superConstructor.class_;
  constructor.super_ = superConstructor;

  return constructor;
}

/**
 * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
 *
 * if any source is <code>null</code> it will be ignored.
 *
 * @param {boolean} own - <code>true</code> to only copy <b>own</b> properties from <code>sources</code> onto
 * <code>target</code>; otherwise <code>false</code>
 * @param {Object} target - the target object which should be extended
 * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
 * @return {void}
 * @private
 */
function extendObject(own, target, sources) {
  sources = slice.call(arguments, 2);

  var property;
  var source;

  for (var i = 0, length = sources.length; i < length; i++) {
    source = sources[i];

    for (property in source) {
      if (!own || hasOwnProperty.call(source, property)) {
        target[property] = source[property];
      }
    }
  }
}

module.exports = extend;
