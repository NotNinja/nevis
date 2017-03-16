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
var CachingHashCodeGenerator = HashCodeGenerator.extend(function() {
  /**
   * A cache of values mapped to their previously generated hash codes.
   *
   * @private
   * @type {Object.<*, number>}
   * @memberof CachingHashCodeGenerator.prototype
   */
  this._cache = {}
}, {

  /**
   * Clears the cache of hash codes that have been previously generated by this {@link CachingHashCodeGenerator} while
   * the <code>allowCache</code> option has been enabled.
   *
   * @return {void}
   * @public
   * @memberof CachingHashCodeGenerator.prototype
   */
  clearCache: function clearCache() {
    this._cache = {}
  },

  /**
   * @inheritdoc
   * @override
   * @memberof CachingHashCodeGenerator.prototype
   */
  generate: function generate(context) {
    var hash = this._cache[context.value]

    if (hash == null) {
      hash = this.generateInternal(context)

      if (context.options.allowCache) {
        this._cache[context.value] = hash
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
   * @memberof CachingHashCodeGenerator.prototype
   */
  generateInternal: /* istanbul ignore next */ function generateInternal(context) {}

})

module.exports = CachingHashCodeGenerator
