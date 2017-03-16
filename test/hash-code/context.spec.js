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

var hashCode = require('../../src/hash-code/index')
var HashCodeContext = require('../../src/hash-code/context')

describe('hash-code/context:HashCodeContext', function() {
  var hashCodeSpy

  beforeEach(function() {
    hashCodeSpy = sinon.spy(hashCode)
  })

  it('should be a constructor', function() {
    expect(HashCodeContext).to.be.a('function')
    expect(new HashCodeContext()).to.be.an('object')
  })

  describe('#copy', function() {
    it('should create a copy of itself but based on the passed value', function() {
      var expectedOptions = {
        allowCache: false,
        filterProperty: function() {
          return false
        },
        skipInherited: true,
        skipMethods: false,
        useHashCodeMethod: false
      }

      var ctx = new HashCodeContext(123, hashCodeSpy, expectedOptions)
      var copy = ctx.copy(321)

      expect(copy).to.be.an.instanceof(HashCodeContext)
      expect(copy.options).not.to.equal(expectedOptions)
      expect(copy.options).to.deep.equal(expectedOptions)
      expect(copy.string).to.equal('[object Number]')
      expect(copy.type).to.equal('number')
      expect(copy.value).to.equal(321)
      expect(copy.hashCode('321')).to.equal(50610)

      expect(hashCodeSpy.calledWith('321', copy.options)).to.be.true
    })
  })

  describe('#hashCode', function() {
    it('should delegate to the hashCode function passed to the constructor', function() {
      var ctx = new HashCodeContext(123, hashCodeSpy)

      expect(ctx.hashCode('123')).to.equal(48690)

      expect(hashCodeSpy.calledWith('123', ctx.options)).to.be.true
    })
  })

  describe('#options', function() {
    context('when options are passed to constructor', function() {
      it('should be based on options passed to constructor', function() {
        var expected = {
          allowCache: false,
          filterProperty: function() {
            return false
          },
          skipInherited: true,
          skipMethods: false,
          useHashCodeMethod: false
        }

        var ctx = new HashCodeContext(123, hashCodeSpy, expected)

        expect(ctx.options).not.to.equal(expected)
        expect(ctx.options).to.deep.equal(expected)
      })
    })

    context('when no options are passed to constructor', function() {
      it('should be based on default options', function() {
        var ctx = new HashCodeContext(123, hashCodeSpy)

        expect(ctx.options).to.be.an('object')
        expect(ctx.options.allowCache).to.be.true
        expect(ctx.options.filterProperty).to.be.a('function')
        expect(ctx.options.filterProperty()).to.be.true
        expect(ctx.options.skipInherited).to.be.false
        expect(ctx.options.skipMethods).to.be.true
        expect(ctx.options.useHashCodeMethod).to.be.true
      })
    })
  })

  describe('#string', function() {
    it('should be based on value passed to constructor', function() {
      var ctx = new HashCodeContext({}, hashCodeSpy)

      expect(ctx.string).to.equal('[object Object]')

      ctx = new HashCodeContext([], hashCodeSpy)

      expect(ctx.string).to.equal('[object Array]')

      ctx = new HashCodeContext(123, hashCodeSpy)

      expect(ctx.string).to.equal('[object Number]')
    })
  })

  describe('#type', function() {
    it('should be based on value passed to constructor', function() {
      var ctx = new HashCodeContext({}, hashCodeSpy)

      expect(ctx.type).to.equal('object')

      ctx = new HashCodeContext([], hashCodeSpy)

      expect(ctx.type).to.equal('object')

      ctx = new HashCodeContext(123, hashCodeSpy)

      expect(ctx.type).to.equal('number')
    })
  })

  describe('#value', function() {
    it('should be value passed to constructor', function() {
      var value = {}
      var ctx = new HashCodeContext(value, hashCodeSpy)

      expect(ctx.value).to.equal(value)
    })
  })
})
