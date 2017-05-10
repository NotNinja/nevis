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
var ObjectEqualsComparator = require('../../../src/equals/comparators/object-comparator');

describe('equals/comparators/object-comparator:ObjectEqualsComparator', function() {
  var comparator;
  var Test;
  var value;

  before(function() {
    Test = function() {};
    Test.prototype.fu = 'baz';
    Test.prototype.buzz = function() {
      return 321;
    };

    comparator = new ObjectEqualsComparator();

    value = new Test();
    value.foo = 'bar';
    value.fizz = function() {
      return 123;
    };
  });

  it('should be a HashEqualsComparator', function() {
    expect(comparator).to.be.an.instanceof(HashEqualsComparator);
  });

  describe('#compare', function() {
    context('when object values are equal', function() {
      it('should return true', function() {
        expect(comparator.compare(new EqualsContext({}, {}, equals))).to.be.true;
        expect(comparator.compare(new EqualsContext({ foo: 'bar' }, { foo: 'bar' }, equals))).to.be.true;
        expect(comparator.compare(new EqualsContext(new Test(), new Test(), equals))).to.be.true;
      });
    });

    context('when object values are not equal', function() {
      it('should return false', function() {
        expect(comparator.compare(new EqualsContext({}, { foo: 'bar' }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext({ foo: 'bar' }, { bar: 'foo' }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext({
          foo: 'bar',
          fu: 'baz'
        }, { fu: 'baz' }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext({
          foo: 'bar',
          fu: 'baz'
        }, {
          fizz: 'buzz',
          quux: 123
        }, equals))).to.be.false;
        expect(comparator.compare(new EqualsContext(value, new Test(), equals))).to.be.false;
      });
    });

    context('when "filterProperty" option is used', function() {
      it('should should only consider filtered properties when comparing object values', function() {
        expect(comparator.compare(new EqualsContext(value, { fu: 'baz' }, equals, {
          filterProperty: function(name) {
            return name === 'fu';
          }
        }))).to.be.true;
      });
    });

    context('when "ignoreInherited" option is enabled', function() {
      it('should ignore inherited properties when comparing object values', function() {
        expect(comparator.compare(new EqualsContext(value, {
          foo: 'bar',
          fizz: value.fizz
        }, equals, { ignoreInherited: true }))).to.be.true;
      });

      context('and "ignoreMethods" option is enabled', function() {
        it('should ignore method properties when comparing object values', function() {
          expect(comparator.compare(new EqualsContext(value, { foo: 'bar' }, equals, {
            ignoreInherited: true,
            ignoreMethods: true
          }))).to.be.true;
        });
      });
    });

    context('when "ignoreMethods" option is enabled', function() {
      it('should ignore method properties when comparing object values', function() {
        expect(comparator.compare(new EqualsContext(value, {
          foo: 'bar',
          fu: 'baz'
        }, equals, { ignoreMethods: true }))).to.be.true;
      });
    });
  });

  describe('#supports', function() {
    it('should return true for object values', function() {
      expect(comparator.supports(new EqualsContext([], null, equals))).to.be.true;
      expect(comparator.supports(new EqualsContext({}, null, equals))).to.be.true;
    });

    it('should return false for other values', function() {
      expect(comparator.supports(new EqualsContext(true, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(123, null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext('foo', null, equals))).to.be.false;
      expect(comparator.supports(new EqualsContext(function foo() {}, null, equals))).to.be.false;
    });
  });
});
