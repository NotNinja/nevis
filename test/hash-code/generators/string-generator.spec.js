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

var CachingHashCodeGenerator = require('../../../src/hash-code/generators/caching-generator')
var hashCode = require('../../../src/hash-code/index')
var HashCodeContext = require('../../../src/hash-code/context')
var StringHashCodeGenerator = require('../../../src/hash-code/generators/string-generator')

describe('hash-code/generators/string-generator:StringHashCodeGenerator', function() {
  var generator

  before(function() {
    generator = new StringHashCodeGenerator()
  })

  it('should be a CachingHashCodeGenerator', function() {
    expect(generator).to.be.an.instanceof(CachingHashCodeGenerator)
  })

  describe('#generate', function() {
    it('should generate hash code for string values', function() {
      expect(generator.generate(new HashCodeContext('', hashCode))).to.equal(0)
      expect(generator.generate(new HashCodeContext(' ', hashCode))).to.equal(32)
      expect(generator.generate(new HashCodeContext('foo', hashCode))).to.equal(101574)
      expect(generator.generate(new HashCodeContext('foo\n\t  bar', hashCode))).to.equal(-876704082)
      expect(generator.generate(new HashCodeContext(' bar ', hashCode))).to.equal(32568973)
      expect(generator.generate(new HashCodeContext('i love generating hash codes', hashCode))).to.equal(1762106987)
    })
  })

  describe('#supports', function() {
    it('should return true for string values', function() {
      expect(generator.supports(new HashCodeContext('foo', hashCode))).to.be.true
    })

    it('should return false for other values', function() {
      expect(generator.supports(new HashCodeContext(true, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(123, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(function foo() {}, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(/foo/, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(new Date(), hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext([ 'foo', 'bar' ], hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext({ foo: 'bar' }, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(new Map(), hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(new Set(), hashCode))).to.be.false
    })
  })
})
