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

var staticHashCode = require('./');

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
    throw new Error('initial must be an odd number');
  }

  if (multiplier == null) {
    multiplier = HashCodeBuilder.DEFAULT_MULTIPLIER_VALUE;
  } else if (multiplier % 2 === 0) {
    throw new Error('multiplier must be an odd number');
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
  this._hash = (this._hash * this._multiplier) + staticHashCode(value, options);

  return this;
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

  return this;
};

/**
 * Returns the computed hash code.
 *
 * @return {number} The hash code based on the appended values.
 * @public
 * @memberof HashCodeBuilder#
 */
HashCodeBuilder.prototype.build = function build() {
  return this._hash;
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
  return this._hash;
};

module.exports = HashCodeBuilder;
