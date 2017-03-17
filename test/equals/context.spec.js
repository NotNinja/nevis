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
var EqualsContext = require('../../src/equals/context')

describe('equals/context:EqualsContext', function() {
  var equalsSpy

  beforeEach(function() {
    equalsSpy = sinon.spy(equals)
  })

  it('should be a constructor', function() {
    expect(EqualsContext).to.be.a('function')
    expect(new EqualsContext()).to.be.an('object')
  })

  describe('#copy', function() {
    it('should create a copy of itself but based on the passed values', function() {
      var expectedOptions = {
        filterProperty: function() {
          return false
        },
        ignoreCase: true,
        skipInherited: true,
        skipMethods: true,
        useEqualsMethod: false
      }

      var ctx = new EqualsContext(123, 321, equalsSpy, expectedOptions)
      var copy = ctx.copy(321, 123)

      expect(copy).to.be.an.instanceof(EqualsContext)
      expect(copy.options).not.to.equal(expectedOptions)
      expect(copy.options).to.deep.equal(expectedOptions)
      expect(copy.other).to.equal(123)
      expect(copy.string).to.equal('[object Number]')
      expect(copy.type).to.equal('number')
      expect(copy.value).to.equal(321)
      expect(copy.equals('321', '123')).to.be.false

      expect(equalsSpy.calledWith('321', '123', copy.options)).to.be.true
    })
  })

  describe('#equals', function() {
    it('should delegate to the equals function passed to the constructor', function() {
      var ctx = new EqualsContext(123, 321, equalsSpy)

      expect(ctx.equals('123', '321')).to.be.false

      expect(equalsSpy.calledWith('123', '321', ctx.options)).to.be.true
    })
  })

  describe('#options', function() {
    context('when options are passed to constructor', function() {
      it('should be based on options passed to constructor', function() {
        var expected = {
          filterProperty: function() {
            return false
          },
          ignoreCase: true,
          skipInherited: true,
          skipMethods: true,
          useEqualsMethod: false
        }

        var ctx = new EqualsContext(123, 321, equalsSpy, expected)

        expect(ctx.options).not.to.equal(expected)
        expect(ctx.options).to.deep.equal(expected)
      })
    })

    context('when no options are passed to constructor', function() {
      it('should be based on default options', function() {
        var ctx = new EqualsContext(123, 312, equalsSpy)

        expect(ctx.options).to.be.an('object')
        expect(ctx.options.filterProperty).to.be.a('function')
        expect(ctx.options.filterProperty()).to.be.true
        expect(ctx.options.ignoreCase).to.be.false
        expect(ctx.options.skipInherited).to.be.false
        expect(ctx.options.skipMethods).to.be.false
        expect(ctx.options.useEqualsMethod).to.be.true
      })
    })
  })

  describe('#other', function() {
    it('should be other value passed to constructor', function() {
      var other = {}
      var ctx = new EqualsContext('foo', other, equalsSpy)

      expect(ctx.other).to.equal(other)
    })
  })

  describe('#string', function() {
    it('should be based on value passed to constructor', function() {
      var ctx = new EqualsContext({}, 'foo', equalsSpy)

      expect(ctx.string).to.equal('[object Object]')

      ctx = new EqualsContext([], 'foo', equalsSpy)

      expect(ctx.string).to.equal('[object Array]')

      ctx = new EqualsContext(123, 'foo', equalsSpy)

      expect(ctx.string).to.equal('[object Number]')
    })
  })

  describe('#type', function() {
    it('should be based on value passed to constructor', function() {
      var ctx = new EqualsContext({}, 'foo', equalsSpy)

      expect(ctx.type).to.equal('object')

      ctx = new EqualsContext([], 'foo', equalsSpy)

      expect(ctx.type).to.equal('object')

      ctx = new EqualsContext(123, 'foo', equalsSpy)

      expect(ctx.type).to.equal('number')
    })
  })

  describe('#validate', function() {
    it('should return whether type of other matches that of value', function() {
      var ctx = new EqualsContext('foo', 'bar', equalsSpy)

      expect(ctx.validate()).to.be.true

      ctx = new EqualsContext({ foo: 'bar' }, { fu: 'baz' }, equalsSpy)

      expect(ctx.validate()).to.be.true

      ctx = new EqualsContext([ 'foo' ], [ 'bar' ], equalsSpy)

      expect(ctx.validate()).to.be.true

      ctx = new EqualsContext([ 'foo' ], { fu: 'baz' }, equalsSpy)

      expect(ctx.validate()).to.be.false

      ctx = new EqualsContext(123, '123', equalsSpy)

      expect(ctx.validate()).to.be.false
    })
  })

  describe('#value', function() {
    it('should be value passed to constructor', function() {
      var value = {}
      var ctx = new EqualsContext(value, 'foo', equalsSpy)

      expect(ctx.value).to.equal(value)
    })
  })
})
