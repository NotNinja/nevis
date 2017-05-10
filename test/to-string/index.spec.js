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

var toString = require('../../src/to-string/index');

describe('to-string/index:toString', function() {
  it('should return result of calling "toString" method', function() {
    expect(toString(0)).to.equal('0');
    expect(toString(NaN)).to.equal('NaN');
    expect(toString({})).to.equal('[object Object]');
    expect(toString([ 'foo', 'bar' ])).to.equal('foo,bar');
  });

  context('when value is null', function() {
    it('should return "null"', function() {
      expect(toString(null)).to.equal('null');
    });
  });

  context('when value is undefined', function() {
    it('should return "undefined"', function() {
      expect(toString()).to.equal('undefined');
    });
  });
});
