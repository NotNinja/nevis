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

var HashCodeGenerator = require('./generator');

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
var HashHashCodeGenerator = HashCodeGenerator.extend({

  /**
   * @inheritdoc
   * @override
   * @memberof HashHashCodeGenerator#
   */
  generate: function generate(context) {
    var entries = this.getEntries(context);

    return entries.reduce(function(hash, entry) {
      return hash + (context.hashCode(entry[0]) ^ context.hashCode(entry[1]));
    }, 0);
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

module.exports = HashHashCodeGenerator;
