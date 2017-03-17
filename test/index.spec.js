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

var equals = require('../src/equals/index')
var EqualsBuilder = require('../src/equals/builder')
var hashCode = require('../src/hash-code/index')
var HashCodeBuilder = require('../src/hash-code/builder')
var index = require('../src/index')
var Nevis = require('../src/nevis')

describe('index:Nevis', function() {
  it('should export Nevis', function() {
    expect(index).to.equal(Nevis)
  })

  describe('.equals', function() {
    it('should reference the internal equals function', function() {
      expect(index.equals).to.equal(equals)
    })
  })

  describe('.EqualsBuilder', function() {
    it('should reference the internal EqualsBuilder constructor', function() {
      expect(index.EqualsBuilder).to.equal(EqualsBuilder)
    })
  })

  describe('.hashCode', function() {
    it('should reference the internal hashCode function', function() {
      expect(index.hashCode).to.equal(hashCode)
    })
  })

  describe('.HashCodeBuilder', function() {
    it('should reference the internal HashCodeBuilder constructor', function() {
      expect(index.HashCodeBuilder).to.equal(HashCodeBuilder)
    })
  })

  describe('#equals', function() {
    it('should perform a strict equality comparison to the other object', function() {
      var Test = index.extend()

      var value = new Test()

      expect(value.equals()).to.be.false
      expect(value.equals(null)).to.be.false
      expect(value.equals(new Test())).to.be.false
      expect(value.equals(value)).to.be.true
    })
  })

  describe('#hashCode', function() {
    it('should generate a hash code for the instance', function() {
      var Test = index.extend({
        fu: 'baz',
        buzz: function() {
          return 321
        }
      })

      var value = new Test()
      value.foo = 'bar'
      value.fizz = function() {
        return 123
      }

      expect(value.hashCode()).to.equal(1669087569)
    })
  })
})
