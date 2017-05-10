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

var extend = require('./extend');

/**
 * The base class from which all others should extend.
 *
 * @public
 * @constructor
 */
function Nevis() {}
Nevis.class_ = 'Nevis';
Nevis.super_ = Object;

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
 * @memberof Nevis
 */
Nevis.extend = extend;

module.exports = Nevis;
