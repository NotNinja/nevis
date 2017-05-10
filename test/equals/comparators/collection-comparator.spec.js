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

var CollectionEqualsComparator = require('../../../src/equals/comparators/collection-comparator');
var equals = require('../../../src/equals/index');
var EqualsContext = require('../../../src/equals/context');
var EqualsComparator = require('../../../src/equals/comparators/comparator');

describe('equals/comparators/collection-comparator:CollectionEqualsComparator', function() {
  var comparator;

  before(function() {
    var TestComparator = CollectionEqualsComparator.extend({
      getElements: function(collection) {
        return collection();
      }
    });

    comparator = new TestComparator();
  });

  it('should be a EqualsComparator', function() {
    expect(comparator).to.be.an.instanceof(EqualsComparator);
  });

  describe('#compare', function() {
    context('when arrays provided by "getElements" method are equal', function() {
      it('should return true', function() {
        expect(comparator.compare(new EqualsContext(function() {
          return [];
        }, function() {
          return [];
        }, equals))).to.be.true;
        expect(comparator.compare(new EqualsContext(function() {
          return [ 'foo', 'bar', 123 ];
        }, function() {
          return [ 'foo', 'bar', 123 ];
        }, equals))).to.be.true;
      });
    });

    context('when arrays provided by "getElements" method are not equal', function() {
      it('should return false', function() {
        expect(comparator.compare(new EqualsContext(function() {
          return [];
        }, function() {
          return [ 'foo', 'bar', 123 ];
        }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(function() {
          return [ 'foo', 'bar', 123 ];
        }, function() {
          return [ 'fu', 'baz', 321 ];
        }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(function() {
          return [ 'foo', 'bar', 123 ];
        }, function() {
          return [ 123, 'bar', 'foo' ];
        }, equals))).to.be.false;
      });
    });
  });

  describe('#getElements', function() {
    it('should be an abstract method', function() {
      expect(CollectionEqualsComparator.prototype.getElements).to.be.a('function');
    });
  });
});
