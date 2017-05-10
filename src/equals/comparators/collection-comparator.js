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
var CollectionEqualsComparator = EqualsComparator.extend({

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
      return false;
    }

    while (length--) {
      if (!context.equals(elements[length], otherElements[length])) {
        return false;
      }
    }

    return true;
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

module.exports = CollectionEqualsComparator;
