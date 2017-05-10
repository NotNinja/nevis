/*
 * Copyright (C) 2017 Alasdair Mercer, !ninja
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

'use strict';

var expect = require('chai').expect;

var equals = require('../../../src/equals/index');
var EqualsContext = require('../../../src/equals/context');
var HashEqualsComparator = require('../../../src/equals/comparators/hash-comparator');
var MapEqualsComparator = require('../../../src/equals/comparators/map-comparator');

describe('equals/comparators/map-comparator:MapEqualsComparator', function() {
  var comparator;

  before(function() {
    comparator = new MapEqualsComparator();
  });

  it('should be a HashEqualsComparator', function() {
    expect(comparator).to.be.an.instanceof(HashEqualsComparator);
  });

  describe('#compare', function() {
    context('when map values are equal', function() {
      it('should return true', function() {
        expect(comparator.compare(new EqualsContext(new Map(), new Map(), equals))).to.be.true;
        expect(comparator.compare(new EqualsContext(new Map([
          [ 'foo', 'bar' ]
        ]), new Map([
          [ 'foo', 'bar' ]
        ]), equals))).to.be.true;
        expect(comparator.compare(new EqualsContext(new Map([
          [ 'foo', 'bar' ],
          [ 'fu', 'baz' ]
        ]), new Map([
          [ 'fu', 'baz' ],
          [ 'foo', 'bar' ]
        ]), equals))).to.be.true;
      });
    });

    context('when map values are not equal', function() {
      it('should return false', function() {
        expect(comparator.compare(new EqualsContext(new Map(), new Map([
          [ 'foo', 'bar' ]
        ]), equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(new Map([
          [ 'foo', 'bar' ]
        ]), new Map([
          [ 'bar', 'foo' ]
        ]), equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(new Map([
          [ 'foo', 'bar' ],
          [ 'fu', 'baz' ]
        ]), new Map([
          [ 'fu', 'baz' ]
        ]), equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(new Map([
          [ 'foo', 'bar' ],
          [ 'fu', 'baz' ]
        ]), new Map([
          [ 'fizz', 'buz' ],
          [ 'quux', 213 ]
        ]), equals))).to.be.false;
      });
    });
  });

  describe('#supports', function() {
    it('should return true for map values', function() {
      expect(comparator.supports(new EqualsContext(new Map(), null, equals))).to.be.true;
    });

    it('should return false for other values', function() {
      expect(comparator.supports(new EqualsContext(true, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(123, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext('foo', null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(function foo() {}, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(/foo/, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(new Date(), null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext([ 'foo', 'bar' ], null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext({ foo: 'bar' }, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(new Set(), null, equals))).to.be.false;
    });
  });
});
