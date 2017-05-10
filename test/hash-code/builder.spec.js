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

var HashCodeBuilder = require('../../src/hash-code/builder');

describe('hash-code/builder:HashCodeBuilder', function() {
  it('should be a constructor', function() {
    expect(HashCodeBuilder).to.be.a('function');
    expect(new HashCodeBuilder()).to.be.an('object');
  });

  context('when initial value is even', function() {
    it('should throw an error', function() {
      expect(function() {
        return new HashCodeBuilder(2);
      }).to.throw('initial must be an odd number');
    });
  });

  context('when multiplier is even', function() {
    it('should throw an error', function() {
      expect(function() {
        return new HashCodeBuilder(null, 2);
      }).to.throw('multiplier must be an odd number');
    });
  });

  describe('.DEFAULT_INITIAL_VALUE', function() {
    it('should be odd', function() {
      expect(HashCodeBuilder.DEFAULT_INITIAL_VALUE % 2 === 0).to.be.false;
    });
  });

  describe('.DEFAULT_MULTIPLIER_VALUE', function() {
    it('should be odd', function() {
      expect(HashCodeBuilder.DEFAULT_MULTIPLIER_VALUE % 2 === 0).to.be.false;
    });
  });

  describe('#append', function() {
    context('when using default initial value and multiplier', function() {
      it('should append hash code generated for value', function() {
        var builder = new HashCodeBuilder();
        expect(builder.append(123)).to.equal(builder);
        expect(builder.append({
          foo: 'bar',
          fu: function() {
            return 321;
          }
        })).to.equal(builder);

        expect(builder.build()).to.equal(2142434625);
      });
    });

    context('when initial value and multiplier is provided', function() {
      it('should append hash code generated for value', function() {
        var builder = new HashCodeBuilder(3, 11);
        expect(builder.append(123)).to.equal(builder);
        expect(builder.append({
          foo: 'bar',
          fu: function() {
            return 321;
          }
        })).to.equal(builder);

        expect(builder.build()).to.equal(2141145775);
      });
    });
  });

  describe('#appendSuper', function() {
    context('when using default initial value and multiplier', function() {
      it('should append super hash code directly', function() {
        var builder = new HashCodeBuilder();
        expect(builder.appendSuper(123)).to.equal(builder);
        expect(builder.append('foo')).to.equal(builder);

        expect(builder.build()).to.equal(129398);
      });
    });

    context('when initial value and multiplier is provided', function() {
      it('should append super hash code directly', function() {
        var builder = new HashCodeBuilder(3, 11);
        expect(builder.appendSuper(123)).to.equal(builder);
        expect(builder.append('foo')).to.equal(builder);

        expect(builder.build()).to.equal(103290);
      });
    });
  });

  describe('#build', function() {
    it('should return the computed hash code', function() {
      var builder = new HashCodeBuilder();
      builder.append('foo');

      expect(builder.build()).to.equal(102203);
    });

    context('when no values are appended', function() {
      it('should return initial value', function() {
        var builder = new HashCodeBuilder();

        expect(builder.build()).to.equal(HashCodeBuilder.DEFAULT_INITIAL_VALUE);

        builder = new HashCodeBuilder(1);

        expect(builder.build()).to.equal(1);
      });
    });
  });

  describe('#hashCode', function() {
    it('should return the computed hash code', function() {
      var builder = new HashCodeBuilder();
      builder.append('foo');

      expect(builder.hashCode()).to.equal(102203);
    });

    context('when no values are appended', function() {
      it('should return initial value', function() {
        var builder = new HashCodeBuilder();

        expect(builder.hashCode()).to.equal(HashCodeBuilder.DEFAULT_INITIAL_VALUE);

        builder = new HashCodeBuilder(1);

        expect(builder.hashCode()).to.equal(1);
      });
    });
  });
});
