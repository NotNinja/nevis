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

var generators = require('./generators');
var HashCodeContext = require('./context');

/**
 * The list of active generators that will be checked for any that support the value before falling back to
 * {@link defaultGenerator}.
 *
 * @private
 * @type {HashCodeGenerator[]}
 */
var activeGenerators = [
  new generators.BooleanHashCodeGenerator(),
  new generators.StringHashCodeGenerator(),
  new generators.DateHashCodeGenerator(),
  new generators.ToStringHashCodeGenerator(),
  new generators.ArrayHashCodeGenerator(),
  new generators.SetHashCodeGenerator(),
  new generators.MapHashCodeGenerator()
];

/**
 * The default generator to be used when no others support the value.
 *
 * @private
 * @type {HashCodeGenerator}
 */
var defaultGenerator = new generators.ObjectHashCodeGenerator();

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
 */
function hashCode(value, options) {
  if (value == null) {
    return 0;
  }

  var context = new HashCodeContext(value, hashCode, options);

  if (!context.options.ignoreHashCode && typeof value.hashCode === 'function') {
    return value.hashCode();
  }

  var generator;
  var length = activeGenerators.length;

  for (var i = 0; i < length; i++) {
    generator = activeGenerators[i];

    if (generator.supports(context)) {
      return generator.generate(context);
    }
  }

  return defaultGenerator.generate(context);
}

/**
 * Clears all previously generated hash codes that may been cached by any active {@link CachingHashCodeGenerator}
 * implementations.
 *
 * Such implementations only cache hash codes generated while the <code>allowCache</code> option is enabled and it is
 * unlikely that an application would be required to call this method, however, it is here if needed and also for
 * testing purposes.
 *
 * @return {void}
 * @public
 * @static
 * @memberof hashCode
 */
hashCode.clearCache = function clearCache() {
  activeGenerators.forEach(function(generator) {
    if (typeof generator.clearCache === 'function') {
      generator.clearCache();
    }
  });
};

module.exports = hashCode;

/**
 * Called with the name and value of a property belonging to an object for which a hash code is being generated to
 * determine whether the hash code for the property should be included in that generated for the object.
 *
 * @callback Nevis~HashCodeFilterPropertyCallback
 * @param {string} name - the name of the property being checked
 * @param {*} value - the value of the property being checked
 * @param {Object} obj - the object to which the property belongs and whose hash code is being generated
 * @return {boolean} <code>true</code> if the hash code for <code>obj</code> should consist of that generated for the
 * given property; otherwise <code>false</code>.
 */

/**
 * The options to be used to generate the hash code.
 *
 * @typedef {Object} Nevis~HashCodeOptions
 * @property {boolean} [allowCache=true] - <code>true</code> to allow generators to cache generated hash codes for
 * faster re-generation; otherwise <code>false</code>. Only applies to implementations of
 * {@link CachingHashCodeGenerator}.
 * @property {Nevis~HashCodeFilterPropertyCallback} [filterProperty] - A function to be called to filter properties
 * based on their name and value when generating hash codes for objects to determine whether they should be included.
 * This is not called for method properties when <code>ignoreMethods</code> is enabled.
 * @property {boolean} [ignoreHashCode] - <code>true</code> to ignore the "hashCode" method on value, when present;
 * otherwise <code>false</code>.
 * @property {boolean} [ignoreInherited] - <code>true</code> to ignore inherited properties when generating hash codes
 * for objects; otherwise <code>false</code>.
 * @property {boolean} [ignoreMethods] - <code>true</code> to ignore method properties when generating hash codes for
 * objects; otherwise <code>false</code>.
 */
