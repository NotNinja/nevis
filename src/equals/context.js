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
 * Contains the values whose equality is to be tested as well as the string representation and type for the value which
 * can be checked elsewhere for type-checking etc.
 *
 * A <code>EqualsContext</code> is <b>only</b> created once it has been determined that both values not exactly equal
 * and neither are <code>null</code>. Once instantiated, {@link EqualsContext#validate} should be called to ensure that
 * both values share the same type.
 *
 * @param {*} value - the value to be checked against <code>other</code>
 * @param {*} other - the other value to be checked against <code>value</code>
 * @param {Function} equals - a reference to {@link Nevis.equals} which can be called within an {@link EqualsComparator}
 * @param {?Nevis~EqualsOptions} options - the options to be used (may be <code>null</code>)
 * @public
 * @constructor
 */
function EqualsContext(value, other, equals, options) {
  if (options == null) {
    options = {};
  }

  /**
   * A reference to {@link Nevis.equals} which can be called within an {@link EqualsComparator}.
   *
   * @private
   * @type {Function}
   */
  this._equals = equals;

  /**
   * The options to be used to test equality for both of the values.
   *
   * @public
   * @type {Nevis~EqualsOptions}
   */
  this.options = {
    filterProperty: options.filterProperty != null ? options.filterProperty : function() {
      return true;
    },
    ignoreCase: Boolean(options.ignoreCase),
    ignoreEquals: Boolean(options.ignoreEquals),
    ignoreInherited: Boolean(options.ignoreInherited),
    ignoreMethods: Boolean(options.ignoreMethods)
  };

  /**
   * The other value to be checked against the <code>value</code>.
   *
   * @public
   * @type {*}
   */
  this.other = other;

  /**
   * The string representation of the values to be tested for equality.
   *
   * This is generated using <code>Object.prototype.toString</code> and is intended to be primarily used for more
   * specific type-checking.
   *
   * @public
   * @type {string}
   */
  this.string = Object.prototype.toString.call(value);

  /**
   * The type of the values to be tested for equality.
   *
   * This is generated using <code>typeof</code> and is intended to be primarily used for simple type-checking.
   *
   * @public
   * @type {string}
   */
  this.type = typeof value;

  /**
   * The value to be checked against the <code>other</code>.
   *
   * @public
   * @type {*}
   */
  this.value = value;
}

/**
 * Creates a copy of this {@link EqualsContext} but for the specified <code>value</code> and <code>other</code> value
 * instead.
 *
 * This method can be useful for when an {@link EqualsComparator} implementation wants to test equality based on a value
 * derived from the original value (e.g. a string representation) and then passing it to a super class.
 *
 * @param {*} value - the value to be checked against <code>other</code>
 * @param {*} other - the other value to be checked against <code>value</code>
 * @return {EqualsContext} A copy of this {@link EqualsContext} for <code>value</code> and <code>other</code>.
 * @public
 * @memberof EqualsContext#
 */
EqualsContext.prototype.copy = function copy(value, other) {
  return new EqualsContext(value, other, this._equals, this.options);
};

/**
 * A convenient shorthand for calling {@link Nevis.equals} from within an {@link EqualsComparator}.
 *
 * @param {*} value - the value to be checked against <code>other</code> (may be <code>null</code>)
 * @param {Function} [value.equals] - the method to be used to test equality for <code>value</code> and
 * <code>other</code>, when present
 * @param {*} other - the other value to be checked against <code>value</code> (may be <code>null</code>)
 * @return {boolean} <code>true</code> if <code>value</code> is equal to <code>other</code>; otherwise
 * <code>false</code>.
 * @public
 * @memberof EqualsContext#
 */
EqualsContext.prototype.equals = function equals(value, other) {
  return this._equals(value, other, this.options);
};

/**
 * Validates this {@link EqualsContext} by checking whether its values share the same type.
 *
 * This method <b>must</b> be called before attempting to call any {@link EqualsComparator} as they are meant to be able
 * to assume that both values share the same type.
 *
 * @return {boolean} <code>true</code> if both values share the same type; otherwise <code>false</code>.
 * @public
 * @memberof EqualsContext#
 */
EqualsContext.prototype.validate = function validate() {
  return this.string === Object.prototype.toString.call(this.other) && this.type === typeof this.other;
};

module.exports = EqualsContext;
