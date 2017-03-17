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

'use strict'

var HashCodeGenerator = require('./generator')

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
var NumberHashCodeGenerator = HashCodeGenerator.extend({

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

})

module.exports = NumberHashCodeGenerator
