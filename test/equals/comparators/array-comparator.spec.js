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

var ArrayEqualsComparator = require('../../../src/equals/comparators/array-comparator')
var CollectionEqualsComparator = require('../../../src/equals/comparators/collection-comparator')
var equals = require('../../../src/equals/index')
var EqualsContext = require('../../../src/equals/context')

describe('equals/comparators/array-comparator:ArrayEqualsComparator', function() {
  var comparator

  before(function() {
    comparator = new ArrayEqualsComparator()
  })

  it('should be a CollectionEqualsComparator', function() {
    expect(comparator).to.be.an.instanceof(CollectionEqualsComparator)
  })

  describe('#compare', function() {
    context('when array values are equal', function() {
      it('should return true', function() {
        expect(comparator.compare(new EqualsContext([], [], equals))).to.be.true
        expect(comparator.compare(new EqualsContext([ 'foo', 'bar', 123 ], [ 'foo', 'bar', 123 ], equals))).to.be.true
        expect(comparator.compare(new EqualsContext(new Int8Array(), new Int8Array(), equals))).to.be.true
        expect(comparator.compare(new EqualsContext(new Int8Array([ 123, 321 ]), new Int8Array([ 123, 321 ]), equals)))
          .to.be.true
      })
    })

    context('when array values are not equal', function() {
      it('should return false', function() {
        expect(comparator.compare(new EqualsContext([], [ 'foo', 'bar', 123 ], equals))).to.be.false
        expect(comparator.compare(new EqualsContext([ 'foo', 'bar', 123 ], [ 'fu', 'baz', 321 ], equals))).to.be.false
        expect(comparator.compare(new EqualsContext([ 'foo', 'bar', 123 ], [ 123, 'bar', 'foo' ], equals))).to.be.false
        expect(comparator.compare(new EqualsContext(new Int8Array(), new Int8Array([ 123, 321 ]), equals))).to.be.false
        expect(comparator.compare(new EqualsContext(new Int8Array([ 123, 321 ]), new Int8Array([ 321, 123 ]), equals)))
          .to.be.false
      })
    })
  })

  describe('#supports', function() {
    it('should return true for array values', function() {
      expect(comparator.supports(new EqualsContext([], null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Int8Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Uint8Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Uint8ClampedArray(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Int16Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Uint16Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Int32Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Uint32Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Float32Array(), null, equals))).to.be.true
      expect(comparator.supports(new EqualsContext(new Float64Array(), null, equals))).to.be.true
    })

    it('should return false for other values', function() {
      expect(comparator.supports(new EqualsContext(true, null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext(123, null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext('foo', null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext(function foo() {}, null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext(/foo/, null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext(new Date(), null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext({ foo: 'bar' }, null, equals))).to.be.false
      expect(comparator.supports(new EqualsContext(new Set(), null, equals))).to.be.false
    })
  })
})
