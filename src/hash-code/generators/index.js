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

var ArrayHashCodeGenerator = require('./array-generator')
var BooleanHashCodeGenerator = require('./boolean-generator')
var CachingHashCodeGenerator = require('./caching-generator')
var CollectionHashCodeGenerator = require('./collection-generator')
var HashCodeGenerator = require('./generator')
var HashHashCodeGenerator = require('./hash-generator')
var NumberHashCodeGenerator = require('./number-generator')
var ObjectHashCodeGenerator = require('./object-generator')
var StringHashCodeGenerator = require('./string-generator')
var ToStringHashCodeGenerator = require('./to-string-generator')
var ValueOfHashCodeGenerator = require('./value-of-generator')

/**
 * A hash containing constructors for all hash code generators.
 *
 * @public
 * @type {Object.<string, Function>}
 */
module.exports = {
  ArrayHashCodeGenerator: ArrayHashCodeGenerator,
  BooleanHashCodeGenerator: BooleanHashCodeGenerator,
  CachingHashCodeGenerator: CachingHashCodeGenerator,
  CollectionHashCodeGenerator: CollectionHashCodeGenerator,
  HashCodeGenerator: HashCodeGenerator,
  HashHashCodeGenerator: HashHashCodeGenerator,
  NumberHashCodeGenerator: NumberHashCodeGenerator,
  ObjectHashCodeGenerator: ObjectHashCodeGenerator,
  StringHashCodeGenerator: StringHashCodeGenerator,
  ToStringHashCodeGenerator: ToStringHashCodeGenerator,
  ValueOfHashCodeGenerator: ValueOfHashCodeGenerator
}
