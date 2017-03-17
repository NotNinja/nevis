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

var expect = require('chai').expect

var ArrayHashCodeGenerator = require('../../../src/hash-code/generators/array-generator')
var BooleanHashCodeGenerator = require('../../../src/hash-code/generators/boolean-generator')
var CachingHashCodeGenerator = require('../../../src/hash-code/generators/caching-generator')
var CollectionHashCodeGenerator = require('../../../src/hash-code/generators/collection-generator')
var HashCodeGenerator = require('../../../src/hash-code/generators/generator')
var generators = require('../../../src/hash-code/generators')
var HashHashCodeGenerator = require('../../../src/hash-code/generators/hash-generator')
var NumberHashCodeGenerator = require('../../../src/hash-code/generators/number-generator')
var ObjectHashCodeGenerator = require('../../../src/hash-code/generators/object-generator')
var StringHashCodeGenerator = require('../../../src/hash-code/generators/string-generator')
var ToStringHashCodeGenerator = require('../../../src/hash-code/generators/to-string-generator')
var ValueOfHashCodeGenerator = require('../../../src/hash-code/generators/value-of-generator')

describe('hash-code/generators/index', function() {
  it('should contain all hash code generator constructors', function() {
    expect(generators).to.deep.equal({
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
    })
  })
})
