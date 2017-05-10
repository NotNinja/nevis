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

var EqualsComparator = require('./comparator');

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
var HashEqualsComparator = EqualsComparator.extend({

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
      return false;
    }

    var key;

    while (length--) {
      key = keys[length];

      if (!context.equals(this.getValue(value, key, context), this.getValue(other, key, context))) {
        return false;
      }
    }

    return true;
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

module.exports = HashEqualsComparator;
