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

var hashCode = require('../../../src/hash-code/index')
var HashCodeContext = require('../../../src/hash-code/context')
var StringHashCodeGenerator = require('../../../src/hash-code/generators/string-generator')
var ToStringHashCodeGenerator = require('../../../src/hash-code/generators/to-string-generator')

describe('hash-code/generators/to-string-generator:ToStringHashCodeGenerator', function() {
  var generator

  before(function() {
    generator = new ToStringHashCodeGenerator()
  })

  it('should be a StringHashCodeGenerator', function() {
    expect(generator).to.be.an.instanceof(StringHashCodeGenerator)
  })

  describe('#generate', function() {
    it('should generate hash code for function values', function() {
      expect(generator.generate(new HashCodeContext(function() {}, hashCode))).to.equal(1657871513)
      expect(generator.generate(new HashCodeContext(function foo() {}, hashCode))).to.equal(-1910270685)
      expect(generator.generate(new HashCodeContext(function foo() {
        return 123
      }, hashCode))).to.equal(-2128254171)
      expect(generator.generate(new HashCodeContext(function bar() {}, hashCode))).to.equal(254160374)
    })

    it('should generate hash code for regular expression values', function() {
      expect(generator.generate(new HashCodeContext(/foo/, hashCode))).to.equal(46554328)
      expect(generator.generate(new HashCodeContext(/foo/i, hashCode))).to.equal(1443184273)
      expect(generator.generate(new HashCodeContext(/bar/, hashCode))).to.equal(46421803)
    })
  })

  describe('#supports', function() {
    it('should return true for function values', function() {
      expect(generator.supports(new HashCodeContext(function foo() {}, hashCode))).to.be.true
    })

    it('should return true for regular expression values', function() {
      expect(generator.supports(new HashCodeContext(/foo/, hashCode))).to.be.true
    })

    it('should return false for other values', function() {
      expect(generator.supports(new HashCodeContext(true, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(123, hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext('foo', hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext(new Date(), hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext([ 'foo', 'bar' ], hashCode))).to.be.false
      expect(generator.supports(new HashCodeContext({ foo: 'bar' }, hashCode))).to.be.false
    })
  })
})
