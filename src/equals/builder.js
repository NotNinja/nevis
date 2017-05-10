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

var staticEquals = require('./');

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
    this._equals = staticEquals(value, other, options);
  }

  return this;
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

  return this;
};

/**
 * Returns whether the values that have been appended to this {@link EqualsBuilder} are all equal.
 *
 * @return {boolean} <code>true</code> if all appended values are equal; otherwise <code>false</code>.
 * @public
 * @memberof EqualsBuilder#
 */
EqualsBuilder.prototype.build = function build() {
  return this._equals;
};

module.exports = EqualsBuilder;
