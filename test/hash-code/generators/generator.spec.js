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

var extend = require('../../../src/extend')
var HashCodeGenerator = require('../../../src/hash-code/generators/generator')

describe('hash-code/generators/generator:HashCodeGenerator', function() {
  it('should be a constructor', function() {
    expect(HashCodeGenerator).to.be.a('function')
    expect(new HashCodeGenerator()).to.be.an('object')
  })

  describe('.class_', function() {
    it('should be HashCodeGenerator', function() {
      expect(HashCodeGenerator.class_).to.equal('HashCodeGenerator')
    })
  })

  describe('.super_', function() {
    it('should be Object', function() {
      expect(HashCodeGenerator.super_).to.equal(Object)
    })
  })

  describe('.extend', function() {
    it('should reference the internal extend function', function() {
      expect(HashCodeGenerator.extend).to.equal(extend)
    })
  })

  describe('#generate', function() {
    it('should be an abstract method', function() {
      expect(HashCodeGenerator.prototype.generate).to.be.a('function')
    })
  })

  describe('#supports', function() {
    it('should be an abstract method', function() {
      expect(HashCodeGenerator.prototype.supports).to.be.a('function')
    })
  })
})
