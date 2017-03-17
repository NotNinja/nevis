(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('nevis', factory) :
  (global.Nevis = factory());
}(this, (function () { 'use strict';

  /*
   * Copyright (C) 2017 Alasdair Mercer, Skelp
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
    /* istanbul ignore else */
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

    return result
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
        return superConstructor.apply(this, arguments)
      };
    }

    extendObject(false, constructor, superConstructor, statics);

    constructor.prototype = createObject(superConstructor.prototype, prototype);
    constructor.prototype.constructor = constructor;

    constructor.class_ = name || superConstructor.class_;
    constructor.super_ = superConstructor;

    return constructor
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

  var extend_1 = extend;

  /**
   * Responsible for comparing the values within a specific {@link EqualsContext} to check whether they are equal.
   *
   * Individual <code>EqualsComparator</code> implementations should attempt to concentrate on specific value types to
   * keep them small and targeted, allowing other implementations to possibly provide a more suitable comparison. The
   * {@link EqualsContext} should <b>never</b> be modified but can be copied via {@link EqualsContext#copy}.
   *
   * A <code>EqualsComparator</code> is <b>only</b> called once it has been determined that the values within the
   * {@link EqualsContext} are not exactly equal, neither are <code>null</code>, and both share the same type.
   *
   * Implementations <b>must</b> implement the {@link EqualsComparator#compare} and {@link EqualsComparator#supports}
   * methods.
   *
   * @protected
   * @constructor
   */
  function EqualsComparator() {}
  EqualsComparator.class_ = 'EqualsComparator';
  EqualsComparator.super_ = Object;

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise "Nevis" will be used instead. The class name may
   * also be used string representation for instances of the child constructor (via <code>toString</code>), but this is
   * not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name="Nevis"] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   * @memberof EqualsComparator
   */
  EqualsComparator.extend = extend_1;

  /**
   * Compares the values within the specified <code>context</code>.
   *
   * This method is only called when {@link EqualsComparator#supports} indicates that this {@link EqualsComparator}
   * supports <code>context</code>.
   *
   * @param {EqualsContext} context - the {@link EqualsContext} whose values are to be compared
   * @return {boolean} <code>true</code> if the values within <code>context</code> are equal; otherwise
   * <code>false</code>.
   * @public
   * @abstract
   * @memberof EqualsComparator#
   */
  EqualsComparator.prototype.compare = /* istanbul ignore next */ function compare(context) {};

  /**
   * Returns whether this {@link EqualsComparator} supports the specified <code>context</code>.
   *
   * This method should only return <code>true</code> when {@link EqualsComparator#compare} can compare the values within
   * <code>context</code>.
   *
   * @param {EqualsContext} context - the {@link EqualsContext} to be checked
   * @return {boolean} <code>true</code> if this {@link EqualsComparator} can compare the values within
   * <code>context</code>; otherwise <code>false</code>.
   * @public
   * @abstract
   * @memberof EqualsComparator#
   */
  EqualsComparator.prototype.supports = /* istanbul ignore next */ function supports(context) {};

  var comparator = EqualsComparator;

  /**
   * An abstract implementation of {@link EqualsComparator} that is intended for implementations that wish to support
   * values types that contain a collection of other values. This is achieved by requesting the elements contained within
   * e value as an array from the implementation and then compares each element to determine whether the values are equal.
   *
   * Implementations <b>must</b> implement the {@link CollectionEqualsComparator#getElements} and
   * {@link EqualsComparator#supports} methods.
   *
   * @protected
   * @constructor
   * @extends EqualsComparator
   */
  var CollectionEqualsComparator = comparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof CollectionEqualsComparator#
     */
    compare: function compare(context) {
      var elements = this.getElements(context.value, context);
      var otherElements = this.getElements(context.other, context);
      var length = elements.length;

      if (length !== otherElements.length) {
        return false
      }

      while (length--) {
        if (!context.equals(elements[length], otherElements[length])) {
          return false
        }
      }

      return true
    },

    /**
     * Returns the elements contained within the specified <code>collection</code>.
     *
     * @param {*} collection - the collection whose elements are to be returned
     * @param {EqualsContext} context - the current {@link EqualsContext}
     * @return {Array} The elements contained within <code>collection</code>.
     * @protected
     * @abstract
     * @memberof CollectionEqualsComparator#
     */
    getElements: /* istanbul ignore next */ function getElements(collection, context) {}

  });

  var collectionComparator = CollectionEqualsComparator;

  /**
   * An implementation of {@link CollectionEqualsComparator} that supports array values.
   *
   * @protected
   * @constructor
   * @extends CollectionEqualsComparator
   */
  var ArrayEqualsComparator = collectionComparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ArrayEqualsComparator#
     */
    getElements: function getElements(collection) {
      return collection
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ArrayEqualsComparator#
     */
    supports: function supports(context) {
      return context.string === '[object Array]'
    }

  });

  var arrayComparator = ArrayEqualsComparator;

  /**
   * An abstract implementation of {@link EqualsComparator} that is intended for implementations that wish to support
   * value types that represent a hash of key/value pairs. This is achieved by requesting the keys contained within each
   * value as an array from the implementation and then compares each key/value pair to determine whether the values are
   * equal.
   *
   * Implementations <b>must</b> implement the {@link HashEqualsComparator#getKeys}, {@link HashEqualsComparator#getValue}
   * and {@link EqualsComparator#supports} methods.
   *
   * @protected
   * @constructor
   * @extends EqualsComparator
   */
  var HashEqualsComparator = comparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof HashEqualsComparator#
     */
    compare: function compare(context) {
      var value = context.value;
      var other = context.other;
      var keys = this.getKeys(value, context);
      var length = keys.length;

      if (length !== this.getKeys(other, context).length) {
        return false
      }

      var key;

      while (length--) {
        key = keys[length];

        if (!context.equals(this.getValue(value, key, context), this.getValue(other, key, context))) {
          return false
        }
      }

      return true
    },

    /**
     * Returns the keys contained within the value of the specified <code>hash</code>.
     *
     * @param {*} hash - the hash whose keys are to be returned
     * @param {EqualsContext} context - the current {@link EqualsContext}
     * @return {Array} The keys contained within <code>hash</code>.
     * @protected
     * @abstract
     * @memberof HashEqualsComparator#
     */
    getKeys: /* istanbul ignore next */ function getKeys(hash, context) {},

    /**
     * Returns the value associated with the specified <code>key</code> in the <code>hash</code> provided.
     *
     * @param {*} hash - the hash from which the value is to be returned
     * @param {*} key - the key for which the associated value is to be returned
     * @param {EqualsContext} context - the current {@link EqualsContext}
     * @return {*} The value for <code>key</code> within <code>hash</code>.
     * @protected
     * @abstract
     * @memberof HashEqualsComparator#
     */
    getValue: /* istanbul ignore next */ function getValue(hash, key, context) {}

  });

  var hashComparator = HashEqualsComparator;

  /**
   * An implementation of {@link EqualsComparator} that supports number values (including <code>NaN</code>).
   *
   * @protected
   * @constructor
   * @extends EqualsComparator
   */
  var NumberEqualsComparator = comparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof NumberEqualsComparator#
     */
    compare: function compare(context) {
      return context.value !== context.value ? context.other !== context.other : context.value === context.other
    },

    /**
     * @inheritdoc
     * @override
     * @memberof NumberEqualsComparator#
     */
    supports: function supports(context) {
      return context.type === 'number'
    }

  });

  var numberComparator = NumberEqualsComparator;

  /**
   * An implementation of {@link HashEqualsComparator} that supports plain old object values.
   *
   * @protected
   * @constructor
   * @extends HashEqualsComparator
   */
  var ObjectEqualsComparator = hashComparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ObjectEqualsComparator#
     */
    getKeys: function getKeys(hash, context) {
      var keys = [];
      var options = context.options;
      var value;

      for (var key in hash) {
        if (!options.skipInherited || Object.prototype.hasOwnProperty.call(hash, key)) {
          value = this.getValue(hash, key, context);

          if ((typeof value !== 'function' || !options.skipMethods) && options.filterProperty(key, value, hash)) {
            keys.push(key);
          }
        }
      }

      return keys
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ObjectEqualsComparator#
     */
    getValue: function getValue(hash, key) {
      return hash[key]
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ObjectEqualsComparator#
     */
    supports: function supports(context) {
      return context.type === 'object'
    }

  });

  var objectComparator = ObjectEqualsComparator;

  /**
   * An implementation of {@link EqualsComparator} that supports miscellaneous values by comparing their string
   * representations (generated by calling <code>toString</code> on each value).
   *
   * This {@link EqualsComparator} currently only supports functions and regular expressions.
   *
   * @protected
   * @constructor
   * @extends EqualsComparator
   */
  var ToStringEqualsComparator = comparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ToStringEqualsComparator#
     */
    compare: function compare(context) {
      return context.value.toString() === context.other.toString()
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ToStringEqualsComparator#
     */
    supports: function supports(context) {
      return context.type === 'function' || context.string === '[object RegExp]'
    }

  });

  var toStringComparator = ToStringEqualsComparator;

  /**
   * An implementation of {@link EqualsComparator} that supports miscellaneous values by comparing their primitive value
   * (determined by calling <code>valueOf</code> on each value).
   *
   * This {@link EqualsComparator} currently only supports dates.
   *
   * @protected
   * @constructor
   * @extends EqualsComparator
   */
  var ValueOfEqualsComparator = comparator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ValueOfEqualsComparator#
     */
    compare: function compare(context) {
      return context.equals(context.value.valueOf(), context.other.valueOf())
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ValueOfEqualsComparator#
     */
    supports: function supports(context) {
      return context.string === '[object Date]'
    }

  });

  var valueOfComparator = ValueOfEqualsComparator;

  /**
   * A hash containing constructors for all equals comparators.
   *
   * @public
   * @type {Object.<string, Function>}
   */
  var index$4 = {
    ArrayEqualsComparator: arrayComparator,
    CollectionEqualsComparator: collectionComparator,
    EqualsComparator: comparator,
    HashEqualsComparator: hashComparator,
    NumberEqualsComparator: numberComparator,
    ObjectEqualsComparator: objectComparator,
    ToStringEqualsComparator: toStringComparator,
    ValueOfEqualsComparator: valueOfComparator
  };

  /*
   * Copyright (C) 2017 Alasdair Mercer, Skelp
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

  /**
   * Contains the values whose equality is to be tested as well as the string representation and type for the value which
   * can be checked elsewhere for type-checking etc.
   *
   * A <code>EqualsContext</code> is <b>only</b> created once it has been determined that both values not exactly equal
   * and neither are <code>null</code>. Once instantiated, {@link EqualsContext#validate} should be called to ensure that
   * both values share the same type.
   *
   * @param {*} value - the value to be checked against <code>other</code>
   * @param {*} other - the other value to be checked against <code>value</code>
   * @param {Function} equals - a reference to {@link Nevis.equals} which can be called within an {@link EqualsComparator}
   * @param {?Nevis~EqualsOptions} options - the options to be used (may be <code>null</code>)
   * @public
   * @constructor
   */
  function EqualsContext(value, other, equals, options) {
    if (options == null) {
      options = {};
    }

    /**
     * A reference to {@link Nevis.equals} which can be called within an {@link EqualsComparator}.
     *
     * @private
     * @type {Function}
     */
    this._equals = equals;

    /**
     * The options to be used to test equality for both of the values.
     *
     * @public
     * @type {Nevis~EqualsOptions}
     */
    this.options = {
      filterProperty: options.filterProperty != null ? options.filterProperty : function() {
        return true
      },
      skipInherited: Boolean(options.skipInherited),
      skipMethods: Boolean(options.skipMethods),
      useEqualsMethod: options.useEqualsMethod !== false
    };

    /**
     * The other value to be checked against the <code>value</code>.
     *
     * @public
     * @type {*}
     */
    this.other = other;

    /**
     * The string representation of the values to be tested for equality.
     *
     * This is generated using <code>Object.prototype.toString</code> and is intended to be primarily used for more
     * specific type-checking.
     *
     * @public
     * @type {string}
     */
    this.string = Object.prototype.toString.call(value);

    /**
     * The type of the values to be tested for equality.
     *
     * This is generated using <code>typeof</code> and is intended to be primarily used for simple type-checking.
     *
     * @public
     * @type {string}
     */
    this.type = typeof value;

    /**
     * The value to be checked against the <code>other</code>.
     *
     * @public
     * @type {*}
     */
    this.value = value;
  }

  /**
   * Creates a copy of this {@link EqualsContext} but for the specified <code>value</code> and <code>other</code> value
   * instead.
   *
   * This method can be useful for when an {@link EqualsComparator} implementation wants to test equality based on a value
   * derived from the original value (e.g. a string representation) and then passing it to a super class.
   *
   * @param {*} value - the value to be checked against <code>other</code>
   * @param {*} other - the other value to be checked against <code>value</code>
   * @return {EqualsContext} A copy of this {@link EqualsContext} for <code>value</code> and <code>other</code>.
   * @public
   * @memberof EqualsContext#
   */
  EqualsContext.prototype.copy = function copy(value, other) {
    return new EqualsContext(value, other, this._equals, this.options)
  };

  /**
   * A convenient shorthand for calling {@link Nevis.equals} from within an {@link EqualsComparator}.
   *
   * @param {*} value - the value to be checked against <code>other</code> (may be <code>null</code>)
   * @param {Function} [value.equals] - the method to be used to test equality for <code>value</code> and
   * <code>other</code>, when present
   * @param {*} other - the other value to be checked against <code>value</code> (may be <code>null</code>)
   * @return {boolean} <code>true</code> if <code>value</code> is equal to <code>other</code>; otherwise
   * <code>false</code>.
   * @public
   * @memberof EqualsContext#
   */
  EqualsContext.prototype.equals = function equals(value, other) {
    return this._equals(value, other, this.options)
  };

  /**
   * Validates this {@link EqualsContext} by checking whether its values share the same type.
   *
   * This method <b>must</b> be called before attempting to call any {@link EqualsComparator} as they are meant to be able
   * to assume that both values share the same type.
   *
   * @return {boolean} <code>true</code> if both values share the same type; otherwise <code>false</code>.
   * @public
   * @memberof EqualsContext#
   */
  EqualsContext.prototype.validate = function validate() {
    return this.string === Object.prototype.toString.call(this.other) && this.type === typeof this.other
  };

  var context = EqualsContext;

  /**
   * The list of active equals comparators that will be checked for any that support the values.
   *
   * @private
   * @type {EqualsComparator[]}
   */
  var activeComparators = [
    new index$4.NumberEqualsComparator(),
    new index$4.ToStringEqualsComparator(),
    new index$4.ValueOfEqualsComparator(),
    new index$4.ArrayEqualsComparator(),
    new index$4.ObjectEqualsComparator()
  ];

  /**
   * Returns whether the specified <code>value</code> is "equal to" the <code>other</code> provided using the given
   * <code>options</code>.
   *
   * Consequently, if both arguments are <code>null</code>, <code>true</code> is returned and if exactly one argument is
   * <code>null</code>, <code>false</code> is returned. Otherwise, this method implements an equivalence relation on
   * non-null object references:
   *
   * <ul>
   *   <li>It is <i>reflexive</i>: for any non-null reference value <code>x</code>, <code>equals(x, x)</code> should
   *   return <code>true</code>.</li>
   *   <li>It is <i>symmetric</i>: for any non-null reference values <code>x</code> and <code>y</code>,
   *   <code>equals(x, y)</code> should return <code>true</code> if and only if <code>equals(y, x)</code> returns
   *   <code>true</code>.</li>
   *   <li>It is <i>transitive</i>: for any non-null reference values <code>x</code>, <code>y</code>, and <code>z</code>,
   *   if <code>equals(x, y)</code> returns <code>true</code> and <code>equals(y, z)</code> returns <code>true</code>,
   *   then <code>equals(x, z)</code> should return <code>true</code>.</li>
   *   <li>It is <i>consistent</i>: for any non-null reference values <code>x</code> and <code>y</code>, multiple
   *   invocations of <code>equals(x, y)</code> consistently return <code>true</code> or consistently return
   *   <code>false</code>, provided no information used in <code>equals</code> comparisons on the objects is
   *   modified.</li>
   *   <li>For any non-null reference value <code>x</code>, <code>equals(x, null)</code> should return
   *   <code>false</code>.</li>
   * </ul>
   *
   * If neither value is <code>null</code> and both are not exactly (strictly) equal, this method will first check whether
   * <code>value</code> has a method named "equals" and, if so, return the result of calling that method with
   * <code>other</code> passed to it. If no "equals" method exists on <code>value</code> or if the
   * <code>useEqualsMethod</code> option is disabled, it will attempt to test the equality internally based on their type.
   *
   * Plain objects are tested recursively for their properties and collections (e.g. arrays) are also tested recursively
   * for their elements.
   *
   * @param {*} value - the value to be checked against <code>other</code> (may be <code>null</code>)
   * @param {Function} [value.equals] - the method to be used to test equality for <code>value</code> and
   * <code>other</code>, when present
   * @param {*} other - the other value to be checked against <code>value</code> (may be <code>null</code>)
   * @param {Nevis~EqualsOptions} [options] - the options to be used (may be <code>null</code>)
   * @return {boolean} <code>true</code> if <code>value</code> is equal to <code>other</code>; otherwise
   * <code>false</code>.
   * @public
   */
  function equals(value, other, options) {
    if (value === other) {
      return true
    }
    if (value == null || other == null) {
      return value === other
    }

    var context$$1 = new context(value, other, equals, options);

    if (context$$1.options.useEqualsMethod && typeof value.equals === 'function') {
      return value.equals(other)
    }

    if (!context$$1.validate()) {
      return false
    }

    var comparator;
    var length = activeComparators.length;

    for (var i = 0; i < length; i++) {
      comparator = activeComparators[i];

      if (comparator.supports(context$$1)) {
        return comparator.compare(context$$1)
      }
    }

    return false
  }

  var index$2 = equals;

  /**
   * Called with the name and value of a property belonging to an object whose equality is being tested to determine
   * whether the property should be checked against that on the other object within the equality test.
   *
   * Keep in mind that including a property on one object but not on the other will almost certainly result in
   * inequality.
   *
   * @callback Nevis~EqualsFilterPropertyCallback
   * @param {string} name - the name of the property being checked
   * @param {*} value - the value of the property being checked
   * @param {Object} obj - the object to which the property belongs and that is being checked against another
   * @return {boolean} <code>true</code> if the equality of the property should be tested against that on the other
   * object; otherwise <code>false</code>.
   */

  /**
   * The options to be used to test equality.
   *
   * @typedef {Object} Nevis~EqualsOptions
   * @property {Nevis~EqualsFilterPropertyCallback} [filterProperty] - A function to be called to filter properties based
   * on their name and value when testing equality of objects to determine whether they should be tested. This is not
   * called for method properties when <code>skipMethods</code> is enabled.
   * @property {boolean} [skipInherited] - <code>true</code> to skip inherited properties when testing equality for
   * objects; otherwise <code>false</code>.
   * @property {boolean} [skipMethods] - <code>true</code> to skip method properties when testing equality for objects;
   * otherwise <code>false</code>.
   * @property {boolean} [useEqualsMethod=true] - <code>true</code> to call "equals" method on value, when present;
   * otherwise <code>false</code>.
   */

  /**
   * Assists in building good equals for complex classes.
   *
   * @public
   * @constructor
   */
  function EqualsBuilder() {
    /**
     * The current equals for this {@link EqualsBuilder}.
     *
     * @private
     * @type {boolean}
     */
    this._equals = true;
  }

  /**
   * Appends the specified <code>value</code> and <code>other</code> to this {@link EqualsBuilder}, testing equality for
   * them using the <code>options</code> provided.
   *
   * @param {*} value - the value to be checked against <code>other</code> (may be <code>null</code>)
   * @param {Function} [value.equals] - the method to be used to check equality for <code>value</code> and
   * <code>other</code>, when present
   * @param {*} other - the other value to be checked against <code>value</code> (may be <code>null</code>)
   * @param {Nevis~EqualsOptions} [options] - the options to be used (may be <code>null</code>)
   * @return {EqualsBuilder} A reference to this {@link EqualsBuilder} for chaining purposes.
   * @public
   * @memberof EqualsBuilder#
   */
  EqualsBuilder.prototype.append = function append(value, other, options) {
    if (this._equals) {
      this._equals = index$2(value, other, options);
    }

    return this
  };

  /**
   * Appends the result of testing equality for a super class to this {@link EqualsBuilder}.
   *
   * @param {boolean} superEquals - the result of testing equality for a super class
   * @return {EqualsBuilder} A reference to this {@link EqualsBuilder} for chaining purposes.
   * @public
   * @memberof EqualsBuilder#
   */
  EqualsBuilder.prototype.appendSuper = function appendSuper(superEquals) {
    if (this._equals) {
      this._equals = superEquals;
    }

    return this
  };

  /**
   * Returns whether the values that have been appended to this {@link EqualsBuilder} are all equal.
   *
   * @return {boolean} <code>true</code> if all appended values are equal; otherwise <code>false</code>.
   * @public
   * @memberof EqualsBuilder#
   */
  EqualsBuilder.prototype.build = function build() {
    return this._equals
  };

  var builder = EqualsBuilder;

  /**
   * Responsible for generating a hash code for a specific {@link HashCodeContext}.
   *
   * Individual <code>HashCodeGenerator</code> implementations should attempt to concentrate on specific value types to
   * keep them small and targeted, allowing other implementations to possibly generate a more suitable hash code. The
   * {@link HashCodeContext} should <b>never</b> be modified but can be copied via {@link HashCodeContext#copy}.
   *
   * Implementations <b>must</b> implement the {@link HashCodeGenerator#generate} and {@link HashCodeGenerator#supports}
   * methods.
   *
   * @protected
   * @constructor
   */
  function HashCodeGenerator() {}
  HashCodeGenerator.class_ = 'HashCodeGenerator';
  HashCodeGenerator.super_ = Object;

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise "Nevis" will be used instead. The class name may
   * also be used string representation for instances of the child constructor (via <code>toString</code>), but this is
   * not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name="Nevis"] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   * @memberof HashCodeGenerator
   */
  HashCodeGenerator.extend = extend_1;

  /**
   * Returns a hash code for the specified <code>context</code>.
   *
   * This method is only called when {@link HashCodeGenerator#supports} indicates that this {@link HashCodeGenerator}
   * supports <code>context</code>.
   *
   * @param {HashCodeContext} context - the {@link HashCodeContext} for which the hash code is to be generated
   * @return {number} The hash code generated for <code>context</code>.
   * @public
   * @abstract
   * @memberof HashCodeGenerator#
   */
  HashCodeGenerator.prototype.generate = /* istanbul ignore next */ function generate(context) {};

  /**
   * Returns whether this {@link HashCodeGenerator} supports the specified <code>context</code>.
   *
   * This method should only return <code>true</code> when {@link HashCodeGenerator#generate} can generate a hash code for
   * <code>context</code>.
   *
   * @param {HashCodeContext} context - the {@link HashCodeContext} to be checked
   * @return {boolean} <code>true</code> if this {@link HashCodeGenerator} can generate a hash code for
   * <code>context</code>; otherwise <code>false</code>.
   * @public
   * @abstract
   * @memberof HashCodeGenerator#
   */
  HashCodeGenerator.prototype.supports = /* istanbul ignore next */ function supports(context) {};

  var generator = HashCodeGenerator;

  /**
   * An abstract implementation of {@link HashCodeGenerator} that is intended for implementations that wish to support
   * value types that contain a collection of other values. This is achieved by requesting the elements contained within
   * the value as an array from the implementation and then generates hash codes for each element to compute the hash code
   * for the value.
   *
   * Implementations <b>must</b> implement the {@link CollectionHashCodeGenerator#getElements} and
   * {@link HashCodeGenerator#supports} methods.
   *
   * @protected
   * @constructor
   * @extends HashCodeGenerator
   */
  var CollectionHashCodeGenerator = generator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof CollectionHashCodeGenerator#
     */
    generate: function generate(context) {
      var elements = this.getElements(context);

      return elements.reduce(function(hash, element) {
        return ((31 * hash) + context.hashCode(element)) | 0
      }, 1)
    },

    /**
     * Returns the elements contained within the value of the specified <code>context</code>.
     *
     * @param {HashCodeContext} context - the {@link HashCodeContext} containing the value whose children elements are to
     * be returned
     * @return {Array} The elements contained within the value of <code>context</code>.
     * @protected
     * @abstract
     * @memberof CollectionHashCodeGenerator#
     */
    getElements: /* istanbul ignore next */ function getElements(context) {}

  });

  var collectionGenerator = CollectionHashCodeGenerator;

  /**
   * An implementation of {@link CollectionHashCodeGenerator} that supports array values.
   *
   * @protected
   * @constructor
   * @extends CollectionHashCodeGenerator
   */
  var ArrayHashCodeGenerator = collectionGenerator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ArrayHashCodeGenerator#
     */
    getElements: function getElements(context) {
      return context.value
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ArrayHashCodeGenerator#
     */
    supports: function support(context) {
      return context.string === '[object Array]'
    }

  });

  var arrayGenerator = ArrayHashCodeGenerator;

  /**
   * An implementation of {@link HashCodeGenerator} that supports boolean values.
   *
   * @protected
   * @constructor
   * @extends HashCodeGenerator
   */
  var BooleanHashCodeGenerator = generator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof BooleanHashCodeGenerator#
     */
    generate: function generate(context) {
      return context.value ? 1231 : 1237
    },

    /**
     * @inheritdoc
     * @override
     * @memberof BooleanHashCodeGenerator#
     */
    supports: function supports(context) {
      return context.type === 'boolean'
    }

  });

  var booleanGenerator = BooleanHashCodeGenerator;

  /**
   * An abstract implementation of {@link HashCodeGenerator} that is intended for implementations that wish to cache
   * generated hash codes to avoid re-generating them for the same values. Obviously, this should only ever be done for
   * immutable values.
   *
   * Generated hash codes should only ever be cached when the <code>allowCache</code> option is enabled, however, the
   * cache will <i>always</i> be checked before attempting to generate a hash code for a value.
   *
   * Implementations <b>must</b> implement the {@link CachingHashCodeGenerator#generateInternal} and
   * {@link HashCodeGenerator#supports} methods.
   *
   * @protected
   * @constructor
   * @extends HashCodeGenerator
   */
  var CachingHashCodeGenerator = generator.extend(function() {
    /**
     * A cache of values mapped to their previously generated hash codes.
     *
     * @private
     * @type {Object.<*, number>}
     * @memberof CachingHashCodeGenerator#
     */
    this._cache = {};
  }, {

    /**
     * Clears the cache of hash codes that have been previously generated by this {@link CachingHashCodeGenerator} while
     * the <code>allowCache</code> option has been enabled.
     *
     * @return {void}
     * @public
     * @memberof CachingHashCodeGenerator#
     */
    clearCache: function clearCache() {
      this._cache = {};
    },

    /**
     * @inheritdoc
     * @override
     * @memberof CachingHashCodeGenerator#
     */
    generate: function generate(context) {
      var hash = this._cache[context.value];

      if (hash == null) {
        hash = this.generateInternal(context);

        if (context.options.allowCache) {
          this._cache[context.value] = hash;
        }
      }

      return hash
    },

    /**
     * Returns a hash code for the specified <code>context</code>.
     *
     * This method is called internally by {@link CachingHashCodeGenerator#generate} only when a hash code needs to be
     * generated (i.e. the cache doesn't contain a previously generated hash code for the value of <code>context</code>).
     *
     * @param {HashCodeContext} context - the {@link HashCodeContext} for which the hash code is to be generated
     * @return {number} The hash code generated for <code>context</code>.
     * @protected
     * @abstract
     * @memberof CachingHashCodeGenerator#
     */
    generateInternal: /* istanbul ignore next */ function generateInternal(context) {}

  });

  var cachingGenerator = CachingHashCodeGenerator;

  /**
   * An abstract implementation of {@link HashCodeGenerator} that is intended for implementations that wish to support
   * value types that represent a hash of key/value pairs. This is achieved by requesting the entries of key/value pairs
   * contained within the value as an multi-dimensional array from the implementation and then generates hash codes for
   * each entry to compute the hash code for the value.
   *
   * Implementations <b>must</b> implement the {@link HashHashCodeGenerator#getEntries} and
   * {@link HashCodeGenerator#supports} methods.
   *
   * @protected
   * @constructor
   * @extends HashCodeGenerator
   */
  var HashHashCodeGenerator = generator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof HashHashCodeGenerator#
     */
    generate: function generate(context) {
      var entries = this.getEntries(context);

      return entries.reduce(function(hash, entry) {
        return hash + (context.hashCode(entry[0]) ^ context.hashCode(entry[1]))
      }, 0)
    },

    /**
     * Returns the entries contained within the value of the specified <code>context</code>.
     *
     * This method returns a multi-dimensional array where each entry is an array consisting of the key and value, in that
     * order.
     *
     * @param {HashCodeContext} context - the {@link HashCodeContext} containing the value whose entries are to be
     * returned
     * @return {Array.<Array>} The entries contained within the value of <code>context</code>.
     * @protected
     * @abstract
     * @memberof HashHashCodeGenerator#
     */
    getEntries: /* istanbul ignore next */ function getEntries(context) {}

  });

  var hashGenerator = HashHashCodeGenerator;

  /**
   * An implementation of {@link HashCodeGenerator} that supports number values.
   *
   * It's important to note that, due to the oddity that is <code>NaN</code>, <code>NaN</code> shares the same hash code
   * as zero; <code>0</code>. This is because hash codes should never be different for the same value and, unfortunately,
   * <code>NaN</code> is never equal to itself. While the current solution may cause conflicts, it has been considered the
   * less of two evils. Best way to avoid conflicts is to sanity check application code to avoid the use of
   * <code>NaN</code> values, especially in hash tables.
   *
   * @protected
   * @constructor
   * @extends HashCodeGenerator
   */
  var NumberHashCodeGenerator = generator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof NumberHashCodeGenerator#
     */
    generate: function generate(context) {
      return context.value !== context.value ? 0 : context.value
    },

    /**
     * @inheritdoc
     * @override
     * @memberof NumberHashCodeGenerator#
     */
    supports: function supports(context) {
      return context.type === 'number'
    }

  });

  var numberGenerator = NumberHashCodeGenerator;

  /**
   * An implementation of {@link HashHashCodeGenerator} that supports plain old object values.
   *
   * @protected
   * @constructor
   * @extends HashHashCodeGenerator
   */
  var ObjectHashCodeGenerator = hashGenerator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ObjectHashCodeGenerator#
     */
    getEntries: function getEntries(context) {
      var entries = [];
      var hash = context.value;
      var options = context.options;
      var value;

      for (var name in hash) {
        if (!options.skipInherited || Object.prototype.hasOwnProperty.call(hash, name)) {
          value = hash[name];

          if ((typeof value !== 'function' || !options.skipMethods) && options.filterProperty(name, value, hash)) {
            entries.push([ name, value ]);
          }
        }
      }

      return entries
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ObjectHashCodeGenerator#
     */
    supports: function supports(context) {
      return context.type === 'object'
    }

  });

  var objectGenerator = ObjectHashCodeGenerator;

  /**
   * An implementation of {@link CachingHashCodeGenerator} that supports string values.
   *
   * @protected
   * @constructor
   * @extends CachingHashCodeGenerator
   */
  var StringHashCodeGenerator = cachingGenerator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof StringHashCodeGenerator#
     */
    generateInternal: function generateInternal(context) {
      var hash = 0;
      var length = context.value.length;

      for (var i = 0; i < length; i++) {
        hash = ((31 * hash) + context.value.charCodeAt(i)) | 0;
      }

      return hash
    },

    /**
     * @inheritdoc
     * @override
     * @memberof StringHashCodeGenerator#
     */
    supports: function supports(context) {
      return context.type === 'string'
    }

  });

  var stringGenerator = StringHashCodeGenerator;

  /**
   * An extension of {@link StringHashCodeGenerator} that supports miscellaneous values by generating hash codes for their
   * string representations (generated by calling <code>toString</code> on the value).
   *
   * This {@link HashCodeGenerator} currently only supports functions and regular expressions.
   *
   * @protected
   * @constructor
   * @extends StringHashCodeGenerator
   */
  var ToStringHashCodeGenerator = stringGenerator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ToStringHashCodeGenerator#
     */
    generate: function generate(context) {
      return ToStringHashCodeGenerator.super_.prototype.generate.call(this, context.copy(context.value.toString()))
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ToStringHashCodeGenerator#
     */
    supports: function supports(context) {
      return context.type === 'function' || context.string === '[object RegExp]'
    }

  });

  var toStringGenerator = ToStringHashCodeGenerator;

  /**
   * An implementation of {@link HashCodeGenerator} that supports miscellaneous values by generating hash codes based on
   * their primitive value (determined by calling <code>valueOf</code> on the value).
   *
   * This {@link HashCodeGenerator} currently only supports dates.
   *
   * @protected
   * @constructor
   * @extends HashCodeGenerator
   */
  var ValueOfHashCodeGenerator = generator.extend({

    /**
     * @inheritdoc
     * @override
     * @memberof ValueOfHashCodeGenerator#
     */
    generate: function generate(context) {
      return context.hashCode(context.value.valueOf())
    },

    /**
     * @inheritdoc
     * @override
     * @memberof ValueOfHashCodeGenerator#
     */
    supports: function supports(context) {
      return context.string === '[object Date]'
    }

  });

  var valueOfGenerator = ValueOfHashCodeGenerator;

  /**
   * A hash containing constructors for all hash code generators.
   *
   * @public
   * @type {Object.<string, Function>}
   */
  var index$8 = {
    ArrayHashCodeGenerator: arrayGenerator,
    BooleanHashCodeGenerator: booleanGenerator,
    CachingHashCodeGenerator: cachingGenerator,
    CollectionHashCodeGenerator: collectionGenerator,
    HashCodeGenerator: generator,
    HashHashCodeGenerator: hashGenerator,
    NumberHashCodeGenerator: numberGenerator,
    ObjectHashCodeGenerator: objectGenerator,
    StringHashCodeGenerator: stringGenerator,
    ToStringHashCodeGenerator: toStringGenerator,
    ValueOfHashCodeGenerator: valueOfGenerator
  };

  /*
   * Copyright (C) 2017 Alasdair Mercer, Skelp
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

  /**
   * Contains the value for which a hash code is to be generated as well string representation and type of the value which
   * can be checked elsewhere for type-checking etc.
   *
   * @param {*} value - the value whose hash code is to be generated
   * @param {Function} hashCode - a reference to {@link Nevis.hashCode} which can be called within a
   * {@link HashCodeGenerator}
   * @param {?Nevis~HashCodeOptions} options - the options to be used (may be <code>null</code>)
   * @protected
   * @constructor
   */
  function HashCodeContext(value, hashCode, options) {
    if (options == null) {
      options = {};
    }

    /**
     * A reference to {@link Nevis.hashCode} which can be called within a {@link HashCodeGenerator}.
     *
     * @private
     * @type {Function}
     */
    this._hashCode = hashCode;

    /**
     * The options to be used to generate the hash code for the value.
     *
     * @public
     * @type {Nevis~HashCodeOptions}
     */
    this.options = {
      allowCache: options.allowCache !== false,
      filterProperty: options.filterProperty != null ? options.filterProperty : function() {
        return true
      },
      skipInherited: Boolean(options.skipInherited),
      skipMethods: Boolean(options.skipMethods),
      useHashCodeMethod: options.useHashCodeMethod !== false
    };

    /**
     * The string representation of the value whose hash code is to be generated.
     *
     * This is generated using <code>Object.prototype.toString</code> and is intended to be primarily used for more
     * specific type-checking.
     *
     * @public
     * @type {string}
     */
    this.string = Object.prototype.toString.call(value);

    /**
     * The type of the value whose hash code is to be generated.
     *
     * This is generated using <code>typeof</code> and is intended to be primarily used for simple type-checking.
     *
     * @public
     * @type {string}
     */
    this.type = typeof value;

    /**
     * The value whose hash code is to be generated.
     *
     * @public
     * @type {*}
     */
    this.value = value;
  }

  /**
   * Creates a copy of this {@link HashCodeContext} but for the specified <code>value</code> instead.
   *
   * This method can be useful for when a {@link HashCodeGenerator} implementation wants to generate the hash code based
   * on a value derived from the original value (e.g. a string representation) and then passing it to a super class.
   *
   * @param {*} value - the value whose hash code is to be generated
   * @return {HashCodeContext} A copy of this {@link HashCodeContext} for <code>value</code>.
   * @public
   * @memberof HashCodeContext#
   */
  HashCodeContext.prototype.copy = function copy(value) {
    return new HashCodeContext(value, this._hashCode, this.options)
  };

  /**
   * A convenient shorthand for calling {@link Nevis.hashCode} from within a {@link HashCodeGenerator}.
   *
   * @param {*} value - the value whose hash code is to be returned (may be <code>null</code>)
   * @param {Function} [value.hashCode] - the method used to produce the hash code for <code>value</code>, when present
   * @return {number} A hash code for <code>value</code>.
   * @public
   * @memberof HashCodeContext#
   */
  HashCodeContext.prototype.hashCode = function hashCode(value) {
    return this._hashCode(value, this.options)
  };

  var context$2 = HashCodeContext;

  /**
   * The list of active generators that will be checked for any that support the value before falling back to
   * {@link defaultGenerator}.
   *
   * @private
   * @type {HashCodeGenerator[]}
   */
  var activeGenerators = [
    new index$8.BooleanHashCodeGenerator(),
    new index$8.NumberHashCodeGenerator(),
    new index$8.StringHashCodeGenerator(),
    new index$8.ToStringHashCodeGenerator(),
    new index$8.ValueOfHashCodeGenerator(),
    new index$8.ArrayHashCodeGenerator()
  ];

  /**
   * The default generator to be used when no others support the value.
   *
   * @private
   * @type {HashCodeGenerator}
   */
  var defaultGenerator = new index$8.ObjectHashCodeGenerator();

  /**
   * Returns a hash code for the specified <code>value</code> using the <code>options</code> provided. This method is
   * supported for the benefit of hash tables.
   *
   * The general contract of <code>hashCode</code> is:
   *
   * <ul>
   *   <li>Whenever it is invoked on the same value more than once during an execution of an application, the
   *   <code>hashCode</code> method must consistently return the same number, provided no information used to generate the
   *   hash code on the value is modified. This number need not remain consistent from one execution of an application to
   *   another execution of the same application.</li>
   *   <li>If two values are equal, that calling the <code>hashCode</code> method on each of the two values must produce
   *   the same number result.</li>
   *   <li>It is <i>not</i> required that if two values are unequal, that calling the <code>hashCode</code> method on each
   *   of the two values must produce distinct number results. However, the programmer should be aware that producing
   *   distinct number results for unequal values may improve the performance of hash tables.</li>
   * </ul>
   *
   * If <code>value</code> is <code>null</code>, this method will always return zero. Otherwise, it will check whether
   * <code>value</code> has a method named "hashCode" and, if so, return the result of calling that method. If no
   * "hashCode" method exists on <code>value</code> or if the <code>useHashCodeMethod</code> option is disabled, it will
   * attempt to generate the hash code internally based on its type.
   *
   * Plain objects are hashed recursively for their properties and collections (e.g. arrays) are also hashed recursively
   * for their elements.
   *
   * @param {*} value - the value whose hash code is to be returned (may be <code>null</code>)
   * @param {Function} [value.hashCode] - the method used to produce the hash code for <code>value</code>, when present
   * @param {Nevis~HashCodeOptions} [options] - the options to be used (may be <code>null</code>)
   * @return {number} A hash code for <code>value</code>.
   * @public
   */
  function hashCode(value, options) {
    if (value == null) {
      return 0
    }

    var context = new context$2(value, hashCode, options);

    if (context.options.useHashCodeMethod && typeof value.hashCode === 'function') {
      return value.hashCode()
    }

    var generator;
    var length = activeGenerators.length;

    for (var i = 0; i < length; i++) {
      generator = activeGenerators[i];

      if (generator.supports(context)) {
        return generator.generate(context)
      }
    }

    return defaultGenerator.generate(context)
  }

  /**
   * Clears all previously generated hash codes that may been cached by any active {@link CachingHashCodeGenerator}
   * implementations.
   *
   * Such implementations only cache hash codes generated while the <code>allowCache</code> option is enabled and it is
   * unlikely that an application would be required to call this method, however, it is here if needed and also for
   * testing purposes.
   *
   * @return {void}
   * @public
   * @static
   * @memberof hashCode
   */
  hashCode.clearCache = function clearCache() {
    activeGenerators.forEach(function(generator) {
      if (typeof generator.clearCache === 'function') {
        generator.clearCache();
      }
    });
  };

  var index$6 = hashCode;

  /**
   * Called with the name and value of a property belonging to an object for which a hash code is being generated to
   * determine whether the hash code for the property should be included in that generated for the object.
   *
   * @callback Nevis~HashCodeFilterPropertyCallback
   * @param {string} name - the name of the property being checked
   * @param {*} value - the value of the property being checked
   * @param {Object} obj - the object to which the property belongs and whose hash code is being generated
   * @return {boolean} <code>true</code> if the hash code for <code>obj</code> should consist of that generated for the
   * given property; otherwise <code>false</code>.
   */

  /**
   * The options to be used to generate the hash code.
   *
   * @typedef {Object} Nevis~HashCodeOptions
   * @property {boolean} [allowCache=true] - <code>true</code> to allow generators to cache generated hash codes for
   * faster re-generation; otherwise <code>false</code>. Only applies to implementations of
   * {@link CachingHashCodeGenerator}.
   * @property {Nevis~HashCodeFilterPropertyCallback} [filterProperty] - A function to be called to filter properties
   * based on their name and value when generating hash codes for objects to determine whether they should be included.
   * This is not called for method properties when <code>skipMethods</code> is enabled.
   * @property {boolean} [skipInherited] - <code>true</code> to skip inherited properties when generating hash codes for
   * objects; otherwise <code>false</code>.
   * @property {boolean} [skipMethods] - <code>true</code> to skip method properties when generating hash codes for
   * objects; otherwise <code>false</code>.
   * @property {boolean} [useHashCodeMethod=true] - <code>true</code> to call "hashCode" method on value, when present;
   * otherwise <code>false</code>.
   */

  /**
   * Assists in building hash codes for complex classes.
   *
   * Ideally the <code>initial</code> value and <code>multiplier</code> should be different for each class, however, this
   * is not vital. Prime numbers are preferred, especially for <code>multiplier</code>.
   *
   * @param {number} [initial=HashCodeBuilder.DEFAULT_INITIAL_VALUE] - the initial value to be used (may be
   * <code>null</code> but cannot be even)
   * @param {number} [multiplier=HashCodeBuilder.DEFAULT_MULTIPLIER_VALUE] - the multiplier to be used (may be
   * <code>null</code> but cannot be even)
   * @throws {Error} If either <code>initial</code> or <code>multiplier</code> are even numbers.
   * @public
   * @constructor
   */
  function HashCodeBuilder(initial, multiplier) {
    if (initial == null) {
      initial = HashCodeBuilder.DEFAULT_INITIAL_VALUE;
    } else if (initial % 2 === 0) {
      throw new Error('initial must be an odd number')
    }

    if (multiplier == null) {
      multiplier = HashCodeBuilder.DEFAULT_MULTIPLIER_VALUE;
    } else if (multiplier % 2 === 0) {
      throw new Error('multiplier must be an odd number')
    }

    /**
     * The current hash code for this {@link HashCodeBuilder}.
     *
     * @private
     * @type {number}
     */
    this._hash = initial;

    /**
     * The multiplier to be used by this {@link HashCodeBuilder}.
     *
     * @private
     * @type {number}
     */
    this._multiplier = multiplier;
  }

  /**
   * The default initial value to use in hash code building.
   *
   * @public
   * @static
   * @type {number}
   * @memberof HashCodeBuilder
   */
  HashCodeBuilder.DEFAULT_INITIAL_VALUE = 17;

  /**
   * The default multiplier value to use in hash code building.
   *
   * @public
   * @static
   * @type {number}
   * @memberof HashCodeBuilder
   */
  HashCodeBuilder.DEFAULT_MULTIPLIER_VALUE = 37;

  /**
   * Appends the specified <code>value</code> to this {@link HashCodeBuilder}, generating the hash code for it using the
   * <code>options</code> provided.
   *
   * @param {*} value - the value whose hash code is to be appended (may be <code>null</code>)
   * @param {Function} [value.hashCode] - the method used to produce the hash code for <code>value</code>, when present
   * @param {Nevis~HashCodeOptions} [options] - the options to be used (may be <code>null</code>)
   * @return {HashCodeBuilder} A reference to this {@link HashCodeBuilder} for chaining purposes.
   * @public
   * @memberof HashCodeBuilder#
   */
  HashCodeBuilder.prototype.append = function append(value, options) {
    this._hash = (this._hash * this._multiplier) + index$6(value, options);

    return this
  };

  /**
   * Appends the result of computing the hash code for a super class to this {@link HashCodeBuilder}.
   *
   * @param {number} superHashCode - the result of computing the hash code for a super class
   * @return {HashCodeBuilder} A reference to this {@link HashCodeBuilder} for chaining purposes.
   * @public
   * @memberof HashCodeBuilder#
   */
  HashCodeBuilder.prototype.appendSuper = function appendSuper(superHashCode) {
    this._hash = (this._hash * this._multiplier) + superHashCode;

    return this
  };

  /**
   * Returns the computed hash code.
   *
   * @return {number} The hash code based on the appended values.
   * @public
   * @memberof HashCodeBuilder#
   */
  HashCodeBuilder.prototype.build = function build() {
    return this._hash
  };

  /**
   * Returns the hash code for this {@link HashCodeBuilder}.
   *
   * This method will return the computed hash code based on the appended values.
   *
   * @return {number} The hash code.
   * @public
   * @memberof HashCodeBuilder#
   */
  HashCodeBuilder.prototype.hashCode = function hashCode() {
    return this._hash
  };

  var builder$2 = HashCodeBuilder;

  /**
   * The base class from which all others should extend.
   *
   * @public
   * @constructor
   */
  function Nevis() {}
  Nevis.class_ = 'Nevis';
  Nevis.super_ = Object;

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise "Nevis" will be used instead. The class name may
   * also be used string representation for instances of the child constructor (via <code>toString</code>), but this is
   * not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name="Nevis"] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   * @memberof Nevis
   */
  Nevis.extend = extend_1;

  var nevis = Nevis;

  /*
   * Copyright (C) 2017 Alasdair Mercer, Skelp
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

  /**
   * Returns the result of calling the <code>toString</code> on the specified <code>value</code> when it is non-null.
   *
   * If <code>value</code> is <code>null</code> or <code>undefined</code>, this method will return "null" or "undefined"
   * respectively.
   *
   * @param {*} value - the value whose string representation is to be returned (may be <code>null</code>)
   * @return {string} The string representation of <code>value</code>.
   * @public
   */
  function toString(value) {
    if (typeof value === 'undefined') {
      return 'undefined'
    }
    if (value == null) {
      return 'null'
    }

    return value.toString()
  }

  var index$10 = toString;

  /**
   * Returns whether the specified <code>value</code> is "equal to" the <code>other</code> provided using the given
   * <code>options</code>.
   *
   * Consequently, if both arguments are <code>null</code>, <code>true</code> is returned and if exactly one argument is
   * <code>null</code>, <code>false</code> is returned. Otherwise, this method implements an equivalence relation on
   * non-null object references:
   *
   * <ul>
   *   <li>It is <i>reflexive</i>: for any non-null reference value <code>x</code>, <code>equals(x, x)</code> should
   *   return <code>true</code>.</li>
   *   <li>It is <i>symmetric</i>: for any non-null reference values <code>x</code> and <code>y</code>,
   *   <code>equals(x, y)</code> should return <code>true</code> if and only if <code>equals(y, x)</code> returns
   *   <code>true</code>.</li>
   *   <li>It is <i>transitive</i>: for any non-null reference values <code>x</code>, <code>y</code>, and <code>z</code>,
   *   if <code>equals(x, y)</code> returns <code>true</code> and <code>equals(y, z)</code> returns <code>true</code>,
   *   then <code>equals(x, z)</code> should return <code>true</code>.</li>
   *   <li>It is <i>consistent</i>: for any non-null reference values <code>x</code> and <code>y</code>, multiple
   *   invocations of <code>equals(x, y)</code> consistently return <code>true</code> or consistently return
   *   <code>false</code>, provided no information used in <code>equals</code> comparisons on the objects is
   *   modified.</li>
   *   <li>For any non-null reference value <code>x</code>, <code>equals(x, null)</code> should return
   *   <code>false</code>.</li>
   * </ul>
   *
   * If neither value is <code>null</code> and both are not exactly (strictly) equal, this method will first check whether
   * <code>value</code> has a method named "equals" and, if so, return the result of calling that method with
   * <code>other</code> passed to it. If no "equals" method exists on <code>value</code> or if the
   * <code>useEqualsMethod</code> option is disabled, it will attempt to test the equality internally based on their type.
   *
   * Plain objects are tested recursively for their properties and collections (e.g. arrays) are also tested recursively
   * for their elements.
   *
   * @param {*} value - the value to be checked against <code>other</code> (may be <code>null</code>)
   * @param {Function} [value.equals] - the method to be used to test equality for <code>value</code> and
   * <code>other</code>, when present
   * @param {*} other - the other value to be checked against <code>value</code> (may be <code>null</code>)
   * @param {Nevis~EqualsOptions} [options] - the options to be used (may be <code>null</code>)
   * @return {boolean} <code>true</code> if <code>value</code> is equal to <code>other</code>; otherwise
   * <code>false</code>.
   * @public
   * @static
   * @memberof Nevis
   */
  nevis.equals = index$2;

  /**
   * Assists in building good equals for complex classes.
   *
   * @public
   * @static
   * @constructor
   * @memberof Nevis
   */
  nevis.EqualsBuilder = builder;

  /**
   * Returns a hash code for the specified <code>value</code> using the <code>options</code> provided. This method is
   * supported for the benefit of hash tables.
   *
   * The general contract of <code>hashCode</code> is:
   *
   * <ul>
   *   <li>Whenever it is invoked on the same value more than once during an execution of an application, the
   *   <code>hashCode</code> method must consistently return the same number, provided no information used to generate the
   *   hash code on the value is modified. This number need not remain consistent from one execution of an application to
   *   another execution of the same application.</li>
   *   <li>If two values are equal, that calling the <code>hashCode</code> method on each of the two values must produce
   *   the same number result.</li>
   *   <li>It is <i>not</i> required that if two values are unequal, that calling the <code>hashCode</code> method on each
   *   of the two values must produce distinct number results. However, the programmer should be aware that producing
   *   distinct number results for unequal values may improve the performance of hash tables.</li>
   * </ul>
   *
   * If <code>value</code> is <code>null</code>, this method will always return zero. Otherwise, it will check whether
   * <code>value</code> has a method named "hashCode" and, if so, return the result of calling that method. If no
   * "hashCode" method exists on <code>value</code> or if the <code>useHashCodeMethod</code> option is disabled, it will
   * attempt to generate the hash code internally based on its type.
   *
   * Plain objects are hashed recursively for their properties and collections (e.g. arrays) are also hashed recursively
   * for their elements.
   *
   * @param {*} value - the value whose hash code is to be returned (may be <code>null</code>)
   * @param {Function} [value.hashCode] - the method used to produce the hash code for <code>value</code>, when present
   * @param {Nevis~HashCodeOptions} [options] - the options to be used (may be <code>null</code>)
   * @return {number} A hash code for <code>value</code>.
   * @public
   * @static
   * @memberof Nevis
   */
  nevis.hashCode = index$6;

  /**
   * Assists in building hash codes for complex classes.
   *
   * Ideally the <code>initial</code> value and <code>multiplier</code> should be different for each class, however, this
   * is not vital. Prime numbers are preferred, especially for <code>multiplier</code>.
   *
   * @param {number} [initial=HashCodeBuilder.DEFAULT_INITIAL_VALUE] - the initial value to be used (may be
   * <code>null</code> but cannot be even)
   * @param {number} [multiplier=HashCodeBuilder.DEFAULT_MULTIPLIER_VALUE] - the multiplier to be used (may be
   * <code>null</code> but cannot be even)
   * @throws {Error} If either <code>initial</code> or <code>multiplier</code> are even numbers.
   * @public
   * @static
   * @constructor
   * @memberof Nevis
   */
  nevis.HashCodeBuilder = builder$2;

  /**
   * Returns the result of calling the <code>toString</code> on the specified <code>value</code> when it is non-null.
   *
   * If <code>value</code> is <code>null</code> or <code>undefined</code>, this method will return "null" or "undefined"
   * respectively.
   *
   * @param {*} value - the value whose string representation is to be returned (may be <code>null</code>)
   * @return {string} The string representation of <code>value</code>.
   * @public
   * @static
   * @memberof Nevis
   */
  nevis.toString = index$10;

  /**
   * Returns whether this instance is "equal to" the specified <code>obj</code>.
   *
   * This method implements an equivalence relation on non-null object references:
   *
   * <ul>
   *   <li>It is <i>reflexive</i>: for any non-null reference value <code>x</code>, <code>equals(x, x)</code> should
   *   return <code>true</code>.</li>
   *   <li>It is <i>symmetric</i>: for any non-null reference values <code>x</code> and <code>y</code>,
   *   <code>equals(x, y)</code> should return <code>true</code> if and only if <code>equals(y, x)</code> returns
   *   <code>true</code>.</li>
   *   <li>It is <i>transitive</i>: for any non-null reference values <code>x</code>, <code>y</code>, and <code>z</code>,
   *   if <code>equals(x, y)</code> returns <code>true</code> and <code>equals(y, z)</code> returns <code>true</code>,
   *   then <code>equals(x, z)</code> should return <code>true</code>.</li>
   *   <li>It is <i>consistent</i>: for any non-null reference values <code>x</code> and <code>y</code>, multiple
   *   invocations of <code>equals(x, y)</code> consistently return <code>true</code> or consistently return
   *   <code>false</code>, provided no information used in <code>equals</code> comparisons on the objects is
   *   modified.</li>
   *   <li>For any non-null reference value <code>x</code>, <code>equals(x, null)</code> should return
   *   <code>false</code>.</li>
   * </ul>
   *
   * The default implementation of this method is the most discriminating possible equivalence relation on objects; that
   * is, for any non-null reference values <code>x</code> and <code>y</code>, this method returns <code>true</code> if,
   * and only if, <code>x</code> and <code>y</code> are exactly equal (<code>x === y</code> has the value
   * <code>true</code>).
   *
   * Please note that it is generally necessary to override the {@link Nevis#hashCode} method whenever this method is
   * overridden, so as to maintain the general contract for the {@link Nevis#hashCode} method, which states that equal
   * objects must have equal hash codes.
   *
   * @param {*} obj - the reference to which this instance is to be compared (may be <code>null</code>)
   * @return {boolean} <code>true</code> if this instance is equal to <code>obj</code>; otherwise <code>false</code>.
   * @public
   * @memberof Nevis#
   */
  nevis.prototype.equals = function equals(obj) {
    return this === obj
  };

  /**
   * Returns the hash code for this instance. This method is supported for the benefit of hash tables.
   *
   * The general contract of <code>hashCode</code> is:
   *
   * <ul>
   *   <li>Whenever it is invoked on the same instance more than once during an execution of an application, the
   *   <code>hashCode</code> method must consistently return the same number, provided no information used to generate the
   *   hash code on the instance is modified. This number need not remain consistent from one execution of an application
   *   to another execution of the same application.</li>
   *   <li>If two instances are equal, that calling the <code>hashCode</code> method on each of the two instances must
   *   produce the same number result.</li>
   *   <li>It is <i>not</i> required that if two instances are unequal, that calling the <code>hashCode</code> method on
   *   each of the two instances must produce distinct number results. However, the programmer should be aware that
   *   producing distinct number results for unequal instances may improve the performance of hash tables.</li>
   * </ul>
   *
   * The default implementation of this method will attempt to generate the hash code based on all of the fields on this
   * class.
   *
   * Please note that it is generally necessary to override the {@link Nevis#equals} method whenever this method is
   * overridden, so as to maintain the above contract where equal objects must have equal hash codes.
   *
   * @return {number} The hash code.
   * @public
   * @memberof Nevis#
   */
  nevis.prototype.hashCode = function hashCode() {
    return index$6(this, { useHashCodeMethod: false })
  };

  /**
   * Returns a string representation of this instance.
   *
   * In general, the {@code Nevis#toString} method returns a string that "textually represents" this instance. The result
   * should be a concise but informative representation that is easy for a person to read.
   *
   * The default implementation of this method will return a string consisting of this instance's class name, the at-sign
   * character (<code>@</code>), and the hexadecimal representation of the hash code of this instance.
   *
   * @return {string} A string representation of this instance.
   * @public
   * @memberof Nevis#
   */
  nevis.prototype.toString = function toString() {
    return this.constructor.class_ + '@' + this.hashCode().toString(16)
  };

  var index = nevis;

  return index;

})));

//# sourceMappingURL=nevis.js.map