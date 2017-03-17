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

var CollectionHashCodeGenerator = require('../../../src/hash-code/generators/collection-generator')
var hashCode = require('../../../src/hash-code/index')
var HashCodeContext = require('../../../src/hash-code/context')
var HashCodeGenerator = require('../../../src/hash-code/generators/generator')

describe('hash-code/generators/collection-generator:CollectionHashCodeGenerator', function() {
  var generator

  before(function() {
    var TestGenerator = CollectionHashCodeGenerator.extend({
      getElements: function(context) {
        return context.value()
      }
    })

    generator = new TestGenerator()
  })

  it('should be a HashCodeGenerator', function() {
    expect(generator).to.be.an.instanceof(HashCodeGenerator)
  })

  describe('#generate', function() {
    it('should generate hash code based on array provided by "getElements" method', function() {
      expect(generator.generate(new HashCodeContext(function() {
        return []
      }, hashCode))).to.equal(1)
      expect(generator.generate(new HashCodeContext(function() {
        return [ 'foo', 123 ]
      }, hashCode))).to.equal(3198445)
    })
  })

  describe('#getElements', function() {
    it('should be an abstract method', function() {
      expect(CollectionHashCodeGenerator.prototype.getElements).to.be.a('function')
    })
  })
})
