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
var HashCodeGenerator = require('../../../src/hash-code/generators/generator')

describe('hash-code/generators/caching-generator:CachingHashCodeGenerator', function() {
  var generator
  var value

  before(function() {
    var TestGenerator = CachingHashCodeGenerator.extend({
      generateInternal: function(context) {
        return context.value()
      }
    })

    generator = new TestGenerator()
    value = function() {
      return Math.floor(Math.random() * 1000)
    }
  })

  beforeEach(function() {
    generator.clearCache()
  })

  it('should be a HashCodeGenerator', function() {
    expect(generator).to.be.an.instanceof(HashCodeGenerator)
  })

  describe('#clearCache', function() {
    it('should clear the cache of previously generated hash codes', function() {
      var hash1 = generator.generate(new HashCodeContext(value, hashCode))

      expect(hash1).to.be.a('number')

      generator.clearCache()

      var hash2 = generator.generate(new HashCodeContext(value, hashCode))

      expect(hash2).to.be.a('number')
      expect(hash2).to.not.equal(hash1)
    })
  })

  describe('#generate', function() {
    it('should generate hash code via "generateInternal" method and cache it', function() {
      var hash1 = generator.generate(new HashCodeContext(value, hashCode))

      expect(hash1).to.be.a('number')

      var hash2 = generator.generate(new HashCodeContext(value, hashCode))

      expect(hash2).to.be.a('number')
      expect(hash2).to.equal(hash1)
    })

    context('when "allowCache" option is disabled', function() {
      it('should not cache generated hash code', function() {
        var hash1 = generator.generate(new HashCodeContext(value, hashCode, { allowCache: false }))

        expect(hash1).to.be.a('number')

        var hash2 = generator.generate(new HashCodeContext(value, hashCode, { allowCache: false }))

        expect(hash2).to.be.a('number')
        expect(hash2).to.not.equal(hash1)
      })

      it('should still return generated hash code previously cached', function() {
        var hash1 = generator.generate(new HashCodeContext(value, hashCode))

        expect(hash1).to.be.a('number')

        var hash2 = generator.generate(new HashCodeContext(value, hashCode, { allowCache: false }))

        expect(hash2).to.be.a('number')
        expect(hash2).to.equal(hash1)
      })
    })
  })

  describe('#generateInternal', function() {
    it('should be an abstract method', function() {
      expect(CachingHashCodeGenerator.prototype.generateInternal).to.be.a('function')
    })
  })
})
