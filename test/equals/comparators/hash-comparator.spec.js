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
var EqualsComparator = require('../../../src/equals/comparators/comparator');
var HashEqualsComparator = require('../../../src/equals/comparators/hash-comparator');

describe('equals/comparators/hash-comparator:HashEqualsComparator', function() {
  var comparator;

  before(function() {
    var TestComparator = HashEqualsComparator.extend({
      getKeys: function(hash) {
        return hash().map(function(entry) {
          return entry[0];
        });
      },
      getValue: function(hash, key) {
        var match = hash().find(function(entry) {
          return entry[0] === key;
        });

        return match && match[1];
      }
    });

    comparator = new TestComparator();
  });

  it('should be a EqualsComparator', function() {
    expect(comparator).to.be.an.instanceof(EqualsComparator);
  });

  describe('#compare', function() {
    context('when hash values are equal', function() {
      it('should return true', function() {
        expect(comparator.compare(new EqualsContext(function() {
          return [];
        }, function() {
          return [];
        }, equals))).to.be.true;
        expect(comparator.compare(new EqualsContext(function() {
          return [
            [ 'foo', 'bar' ],
            [ 'fu', 'baz' ]
          ];
        }, function() {
          return [
            [ 'foo', 'bar' ],
            [ 'fu', 'baz' ]
          ];
        }, equals))).to.be.true;
      });
    });

    context('when hash values are not equal', function() {
      it('should return false', function() {
        expect(comparator.compare(new EqualsContext(function() {
          return [];
        }, function() {
          return [
            [ 'foo', 'bar' ]
          ];
        }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(function() {
          return [
            [ 'foo', 'bar' ]
          ];
        }, function() {
          return [
            [ 'bar', 'foo' ]
          ];
        }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(function() {
          return [
            [ 'foo', 'bar' ],
            [ 'fu', 'baz' ]
          ];
        }, function() {
          return [
            [ 'fu', 'baz' ]
          ];
        }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(function() {
          return [
            [ 'foo', 'bar' ],
            [ 'fu', 'baz' ]
          ];
        }, function() {
          return [
            [ 'fizz', 'buzz' ],
            [ 'quux', 123 ]
          ];
        }, equals))).to.be.false;
      });
    });
  });

  describe('#getKeys', function() {
    it('should be an abstract method', function() {
      expect(HashEqualsComparator.prototype.getKeys).to.be.a('function');
    });
  });

  describe('#getValue', function() {
    it('should be an abstract method', function() {
      expect(HashEqualsComparator.prototype.getValue).to.be.a('function');
    });
  });
});

