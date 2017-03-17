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
var sinon = require('sinon')

var equals = require('../../src/equals/index')

describe('equals/index:equals', function() {
  it('should be a function', function() {
    expect(equals).to.be.a('function')
  })

  context('when a comparator supports values', function() {
    it('should return result of comparator', function() {
      expect(equals([ 'foo', 'bar' ], [ 'foo', 'bar' ])).to.be.true
    })
  })

  context('when no comparator supports values', function() {
    it('should return false', function() {
      expect(equals(true, false)).to.be.false
    })
  })

  context('when value is reference to other', function() {
    it('should return true', function() {
      var value = {}

      expect(equals(value, value)).to.be.true
    })
  })

  context('when value is null', function() {
    context('and other is not null', function() {
      it('should return false', function() {
        expect(equals(null, {})).to.be.false
      })
    })

    context('and other is null', function() {
      it('should return true', function() {
        expect(equals(null, null)).to.be.true
      })
    })
  })

  context('when value and other are undefined', function() {
    it('should return true', function() {
      expect(equals()).to.be.true
    })
  })

  context('when value and other have different types', function() {
    it('should return false', function() {
      expect(equals('foo', /foo/)).to.be.false
    })
  })

  context('when value has "equals" method', function() {
    it('should return result of calling "equals" method', function() {
      var other = {}
      var value = {
        equals: function(obj) {
          return obj === other
        }
      }

      expect(equals(value, 'other')).to.be.false
      expect(equals(value, other)).to.be.true
    })

    context('and "useEqualsMethod" option is disabled', function() {
      it('should ignore "equals" method', function() {
        var other = {}
        var value = {
          equals: function() {
            return true
          }
        }

        sinon.spy(value, 'equals')

        expect(equals(value, other, { useEqualsMethod: false })).to.be.false
        expect(value.equals.notCalled).to.be.true
      })
    })
  })
})
