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

var EqualsBuilder = require('./equals/builder');
var HashCodeBuilder = require('./hash-code/builder');
var Nevis = require('./nevis');
var staticEquals = require('./equals');
var staticHashCode = require('./hash-code');
var staticToString = require('./to-string');

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
 * @static
 * @memberof Nevis
 */
Nevis.equals = staticEquals;

/**
 * Assists in building good equals for complex classes.
 *
 * @public
 * @static
 * @constructor
 * @memberof Nevis
 */
Nevis.EqualsBuilder = EqualsBuilder;

/**
 * Returns a hash code for the specified <code>value</code> using the <code>options</code> provided. This method is
 * supported for the benefit of hash tables.
 *
 * The general contract of <code>hashCode</code> is:
 *
 * <ul>
 *   <li>Whenever it is invoked on the same value more than once during an execution of an application, the
 *   <code>hashCode</code> method must consistently return the same number, provided no information used to generate the
 *   hash code on the value is modified. This number need not remain consistent from one execution of an application to
 *   another execution of the same application.</li>
 *   <li>If two values are equal, that calling the <code>hashCode</code> method on each of the two values must produce
 *   the same number result.</li>
 *   <li>It is <i>not</i> required that if two values are unequal, that calling the <code>hashCode</code> method on each
 *   of the two values must produce distinct number results. However, the programmer should be aware that producing
 *   distinct number results for unequal values may improve the performance of hash tables.</li>
 * </ul>
 *
 * If <code>value</code> is <code>null</code>, this method will always return zero. Otherwise, it will check whether
 * <code>value</code> has a method named "hashCode" and, if so, return the result of calling that method. If no
 * "hashCode" method exists on <code>value</code> or if the <code>ignoreHashCode</code> option is enabled, it will
 * attempt to generate the hash code internally based on its type.
 *
 * Plain objects are hashed recursively for their properties and collections (e.g. arrays) are also hashed recursively
 * for their elements.
 *
 * @param {*} value - the value whose hash code is to be returned (may be <code>null</code>)
 * @param {Function} [value.hashCode] - the method used to produce the hash code for <code>value</code>, when present
 * @param {Nevis~HashCodeOptions} [options] - the options to be used (may be <code>null</code>)
 * @return {number} A hash code for <code>value</code>.
 * @public
 * @static
 * @memberof Nevis
 */
Nevis.hashCode = staticHashCode;

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
 * @static
 * @constructor
 * @memberof Nevis
 */
Nevis.HashCodeBuilder = HashCodeBuilder;

/**
 * Returns the result of calling the <code>toString</code> method on the specified <code>value</code> when it is
 * non-null.
 *
 * If <code>value</code> is <code>null</code> or <code>undefined</code>, this method will return <code>"null"</code> or
 * <code>"undefined"</code> respectively.
 *
 * @param {*} value - the value whose string representation is to be returned (may be <code>null</code>)
 * @return {string} The string representation of <code>value</code>.
 * @public
 * @static
 * @memberof Nevis
 */
Nevis.toString = staticToString;

/**
 * Returns whether this instance is "equal to" the specified <code>obj</code>.
 *
 * This method implements an equivalence relation on non-null object references:
 *
 * <ul>
 *   <li>It is <i>reflexive</i>: for any non-null reference value <code>x</code>, <code>x.equals(x)</code> should return
 *   <code>true</code>.</li>
 *   <li>It is <i>symmetric</i>: for any non-null reference values <code>x</code> and <code>y</code>,
 *   <code>x.equals(y)</code> should return <code>true</code> if and only if <code>y.equals(x)</code> returns
 *   <code>true</code>.</li>
 *   <li>It is <i>transitive</i>: for any non-null reference values <code>x</code>, <code>y</code>, and <code>z</code>,
 *   if <code>x.equals(y)</code> returns <code>true</code> and <code>y.equals(z)</code> returns <code>true</code>, then
 *   <code>x.equals(z)</code> should return <code>true</code>.</li>
 *   <li>It is <i>consistent</i>: for any non-null reference values <code>x</code> and <code>y</code>, multiple
 *   invocations of <code>x.equals(y)</code> consistently return <code>true</code> or consistently return
 *   <code>false</code>, provided no information used in <code>equals</code> comparisons on the objects is
 *   modified.</li>
 *   <li>For any non-null reference value <code>x</code>, <code>x.equals(null)</code> should return
 *   <code>false</code>.</li>
 * </ul>
 *
 * The default implementation of this method is the most discriminating possible equivalence relation on objects; that
 * is, for any non-null reference values <code>x</code> and <code>y</code>, this method returns <code>true</code> if,
 * and only if, <code>x</code> and <code>y</code> are exactly equal (<code>x === y</code> has the value
 * <code>true</code>).
 *
 * Please note that it is generally necessary to override the {@link Nevis#hashCode} method whenever this method is
 * overridden, so as to maintain the general contract for the {@link Nevis#hashCode} method, which states that equal
 * objects must have equal hash codes.
 *
 * @param {*} obj - the reference to which this instance is to be compared (may be <code>null</code>)
 * @return {boolean} <code>true</code> if this instance is equal to <code>obj</code>; otherwise <code>false</code>.
 * @public
 * @memberof Nevis#
 */
Nevis.prototype.equals = function equals(obj) {
  return this === obj;
};

/**
 * Returns the hash code for this instance. This method is supported for the benefit of hash tables.
 *
 * The general contract of <code>hashCode</code> is:
 *
 * <ul>
 *   <li>Whenever it is invoked on the same instance more than once during an execution of an application, the
 *   <code>hashCode</code> method must consistently return the same number, provided no information used to generate the
 *   hash code on the instance is modified. This number need not remain consistent from one execution of an application
 *   to another execution of the same application.</li>
 *   <li>If two instances are equal, that calling the <code>hashCode</code> method on each of the two instances must
 *   produce the same number result.</li>
 *   <li>It is <i>not</i> required that if two instances are unequal, that calling the <code>hashCode</code> method on
 *   each of the two instances must produce distinct number results. However, the programmer should be aware that
 *   producing distinct number results for unequal instances may improve the performance of hash tables.</li>
 * </ul>
 *
 * The default implementation of this method will attempt to generate the hash code based on all of the fields on this
 * instance.
 *
 * Please note that it is generally necessary to override the {@link Nevis#equals} method whenever this method is
 * overridden, so as to maintain the above contract where equal objects must have equal hash codes.
 *
 * @return {number} The hash code.
 * @public
 * @memberof Nevis#
 */
Nevis.prototype.hashCode = function hashCode() {
  return staticHashCode(this, { ignoreHashCode: true });
};

/**
 * Returns a string representation of this instance.
 *
 * In general, the {@code Nevis#toString} method returns a string that "textually represents" this instance. The result
 * should be a concise but informative representation that is easy for a person to read.
 *
 * The default implementation of this method will return a string consisting of this instance's class name, the at-sign
 * character (<code>@</code>), and the hexadecimal representation of the hash code of this instance.
 *
 * @return {string} A string representation of this instance.
 * @public
 * @memberof Nevis#
 */
Nevis.prototype.toString = function toString() {
  return this.constructor.class_ + '@' + this.hashCode().toString(16);
};

module.exports = Nevis;
