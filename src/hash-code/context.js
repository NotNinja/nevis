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
      return true;
    },
    ignoreHashCode: Boolean(options.ignoreHashCode),
    ignoreInherited: Boolean(options.ignoreInherited),
    ignoreMethods: Boolean(options.ignoreMethods)
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
  return new HashCodeContext(value, this._hashCode, this.options);
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
  return this._hashCode(value, this.options);
};

module.exports = HashCodeContext;
