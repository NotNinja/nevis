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

var HashEqualsComparator = require('./hash-comparator');

/**
 * An implementation of {@link HashEqualsComparator} that supports map values.
 *
 * <code>MapEqualsComparator</code> ignores insertion order when comparing maps.
 *
 * @protected
 * @constructor
 * @extends HashEqualsComparator
 */
var MapEqualsComparator = HashEqualsComparator.extend({

  /**
   * @inheritdoc
   * @override
   * @memberof MapEqualsComparator#
   */
  getKeys: function getKeys(hash) {
    return Array.from(hash.keys());
  },

  /**
   * @inheritdoc
   * @override
   * @memberof MapEqualsComparator#
   */
  getValue: function getValue(hash, key) {
    return hash.get(key);
  },

  /**
   * @inheritdoc
   * @override
   * @memberof MapEqualsComparator#
   */
  supports: function supports(context) {
    return context.string === '[object Map]';
  }

});

module.exports = MapEqualsComparator;
