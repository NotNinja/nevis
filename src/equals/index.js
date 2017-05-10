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

var comparators = require('./comparators');
var EqualsContext = require('./context');

/**
 * The list of active equals comparators that will be checked for any that support the values.
 *
 * @private
 * @type {EqualsComparator[]}
 */
var activeComparators = [
  new comparators.NumberEqualsComparator(),
  new comparators.StringEqualsComparator(),
  new comparators.DateEqualsComparator(),
  new comparators.ToStringEqualsComparator(),
  new comparators.ArrayEqualsComparator(),
  new comparators.SetEqualsComparator(),
  new comparators.MapEqualsComparator(),
  new comparators.ObjectEqualsComparator()
];

/**
 * Returns whether the specified <code>value</code> is "equal to" the <code>other</code> provided using the given
 * <code>options</code>.
 *
 * Consequently, if both arguments are <code>null</code>, <code>true</code> is returned and if exactly one argument is
 * <code>null</code>, <code>false</code> is returned. Otherwise, this method implements an equivalence relation on
 * non-null object references:
 *
 * <ul>
 *   <li>It is <i>reflexive</i>: for any non-null reference value <code>x</code>, <code>equals(x, x)</code> should
 *   return <code>true</code>.</li>
 *   <li>It is <i>symmetric</i>: for any non-null reference values <code>x</code> and <code>y</code>,
 *   <code>equals(x, y)</code> should return <code>true</code> if and only if <code>equals(y, x)</code> returns
 *   <code>true</code>.</li>
 *   <li>It is <i>transitive</i>: for any non-null reference values <code>x</code>, <code>y</code>, and <code>z</code>,
 *   if <code>equals(x, y)</code> returns <code>true</code> and <code>equals(y, z)</code> returns <code>true</code>,
 *   then <code>equals(x, z)</code> should return <code>true</code>.</li>
 *   <li>It is <i>consistent</i>: for any non-null reference values <code>x</code> and <code>y</code>, multiple
 *   invocations of <code>equals(x, y)</code> consistently return <code>true</code> or consistently return
 *   <code>false</code>, provided no information used in <code>equals</code> comparisons on the objects is
 *   modified.</li>
 *   <li>For any non-null reference value <code>x</code>, <code>equals(x, null)</code> should return
 *   <code>false</code>.</li>
 * </ul>
 *
 * If neither value is <code>null</code> and both are not exactly (strictly) equal, this method will first check whether
 * <code>value</code> has a method named "equals" and, if so, return the result of calling that method with
 * <code>other</code> passed to it. If no "equals" method exists on <code>value</code> or if the
 * <code>ignoreEquals</code> option is enabled, it will attempt to test the equality internally based on their type.
 *
 * Plain objects are tested recursively for their properties and collections (e.g. arrays) are also tested recursively
 * for their elements.
 *
 * @param {*} value - the value to be checked against <code>other</code> (may be <code>null</code>)
 * @param {Function} [value.equals] - the method to be used to test equality for <code>value</code> and
 * <code>other</code>, when present
 * @param {*} other - the other value to be checked against <code>value</code> (may be <code>null</code>)
 * @param {Nevis~EqualsOptions} [options] - the options to be used (may be <code>null</code>)
 * @return {boolean} <code>true</code> if <code>value</code> is equal to <code>other</code>; otherwise
 * <code>false</code>.
 * @public
 */
function equals(value, other, options) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null) {
    return value === other;
  }

  var context = new EqualsContext(value, other, equals, options);

  if (!context.options.ignoreEquals && typeof value.equals === 'function') {
    return value.equals(other);
  }

  if (!context.validate()) {
    return false;
  }

  var comparator;
  var length = activeComparators.length;

  for (var i = 0; i < length; i++) {
    comparator = activeComparators[i];

    if (comparator.supports(context)) {
      return comparator.compare(context);
    }
  }

  return false;
}

module.exports = equals;

/**
 * Called with the name and value of a property belonging to an object whose equality is being tested to determine
 * whether the property should be checked against that on the other object within the equality test.
 *
 * Keep in mind that including a property on one object but not on the other will almost certainly result in
 * inequality.
 *
 * @callback Nevis~EqualsFilterPropertyCallback
 * @param {string} name - the name of the property being checked
 * @param {*} value - the value of the property being checked
 * @param {Object} obj - the object to which the property belongs and that is being checked against another
 * @return {boolean} <code>true</code> if the equality of the property should be tested against that on the other
 * object; otherwise <code>false</code>.
 */

/**
 * The options to be used to test equality.
 *
 * @typedef {Object} Nevis~EqualsOptions
 * @property {Nevis~EqualsFilterPropertyCallback} [filterProperty] - A function to be called to filter properties based
 * on their name and value when testing equality of objects to determine whether they should be tested. This is not
 * called for method properties when <code>ignoreMethods</code> is enabled.
 * @property {boolean} [ignoreCase] - <code>true</code> to ignore case when testing equality for strings; otherwise
 * <code>false</code>.
 * @property {boolean} [ignoreEquals] - <code>true</code> to ignore the "equals" method on value, when present;
 * otherwise <code>false</code>.
 * @property {boolean} [ignoreInherited] - <code>true</code> to ignore inherited properties when testing equality for
 * objects; otherwise <code>false</code>.
 * @property {boolean} [ignoreMethods] - <code>true</code> to ignore method properties when testing equality for
 * objects; otherwise <code>false</code>.
 */
