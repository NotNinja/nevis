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

var hash = require('./hash-code')
var HashCodeBuilder = require('./hash-code/builder')
var Nevis = require('./nevis')

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
 * "hashCode" method exists on <code>value</code> or if the <code>useHashCodeMethod</code> option is disabled, it will
 * attempt to find a {@link HashCodeGenerator} that supports <code>value</code>. Finally, if no generator could be found
 * that supports <code>value</code>, it will fall back to the default generator (i.e. {@link ObjectHashCodeGenerator})
 * which should support most other objects.
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
Nevis.hashCode = hash

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
Nevis.HashCodeBuilder = HashCodeBuilder

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
 * This method will attempt to find a {@link HashCodeGenerator} that supports this instance. However, if no generator
 * could be found that supports this instance, it will fall back to the default generator (i.e.
 * {@link ObjectHashCodeGenerator}) which should support most other objects.
 *
 * @return {number} The hash code.
 * @public
 * @memberof Nevis.prototype
 */
Nevis.prototype.hashCode = function hashCode() {
  return hash(this, {
    skipMethods: false,
    useHashCodeMethod: false
  })
}

module.exports = Nevis
