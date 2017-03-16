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
 * An implementation of {@link HashCodeGenerator} that supports miscellaneous values by generating hash codes based on
 * their primitive value (determined by calling <code>valueOf</code> on the value).
 *
 * This {@link HashCodeGenerator} currently only supports dates.
 *
 * @protected
 * @constructor
 * @extends HashCodeGenerator
 */
var ValueOfHashCodeGenerator = HashCodeGenerator.extend({

  /**
   * @inheritdoc
   * @override
   * @memberof ValueOfHashCodeGenerator.prototype
   */
  generate: function generate(context) {
    return context.hashCode(context.value.valueOf())
  },

  /**
   * @inheritdoc
   * @override
   * @memberof ValueOfHashCodeGenerator.prototype
   */
  supports: function supports(context) {
    return context.string === '[object Date]'
  }

})

module.exports = ValueOfHashCodeGenerator
