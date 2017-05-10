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

var extend = require('../../extend');

/**
 * Responsible for comparing the values within a specific {@link EqualsContext} to check whether they are equal.
 *
 * Individual <code>EqualsComparator</code> implementations should attempt to concentrate on specific value types to
 * keep them small and targeted, allowing other implementations to possibly provide a more suitable comparison. The
 * {@link EqualsContext} should <b>never</b> be modified but can be copied via {@link EqualsContext#copy}.
 *
 * A <code>EqualsComparator</code> is <b>only</b> called once it has been determined that the values within the
 * {@link EqualsContext} are not exactly equal, neither are <code>null</code>, and both share the same type.
 *
 * Implementations <b>must</b> implement the {@link EqualsComparator#compare} and {@link EqualsComparator#supports}
 * methods.
 *
 * @protected
 * @constructor
 */
function EqualsComparator() {}
EqualsComparator.class_ = 'EqualsComparator';
EqualsComparator.super_ = Object;

/**
 * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
 * <code>statics</code> provided.
 *
 * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
 * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
 * instead. The class name may also be used string representation for instances of the child constructor (via
 * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
 *
 * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
 * constructor which only calls the super constructor will be used instead.
 *
 * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
 *
 * @param {string} [name=this.class_] - the class name to be used for the child constructor
 * @param {Function} [constructor] - the constructor for the child
 * @param {Object} [prototype] - the prototype properties to be defined for the child
 * @param {Object} [statics] - the static properties to be defined for the child
 * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
 * @public
 * @static
 * @memberof EqualsComparator
 */
EqualsComparator.extend = extend;

/**
 * Compares the values within the specified <code>context</code>.
 *
 * This method is only called when {@link EqualsComparator#supports} indicates that this {@link EqualsComparator}
 * supports <code>context</code>.
 *
 * @param {EqualsContext} context - the {@link EqualsContext} whose values are to be compared
 * @return {boolean} <code>true</code> if the values within <code>context</code> are equal; otherwise
 * <code>false</code>.
 * @public
 * @abstract
 * @memberof EqualsComparator#
 */
EqualsComparator.prototype.compare = /* istanbul ignore next */ function compare(context) {};

/**
 * Returns whether this {@link EqualsComparator} supports the specified <code>context</code>.
 *
 * This method should only return <code>true</code> when {@link EqualsComparator#compare} can compare the values within
 * <code>context</code>.
 *
 * @param {EqualsContext} context - the {@link EqualsContext} to be checked
 * @return {boolean} <code>true</code> if this {@link EqualsComparator} can compare the values within
 * <code>context</code>; otherwise <code>false</code>.
 * @public
 * @abstract
 * @memberof EqualsComparator#
 */
EqualsComparator.prototype.supports = /* istanbul ignore next */ function supports(context) {};

module.exports = EqualsComparator;
