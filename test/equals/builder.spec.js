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

var EqualsBuilder = require('../../src/equals/builder')

describe('equals/builder:EqualsBuilder', function() {
  it('should be a constructor', function() {
    expect(EqualsBuilder).to.be.a('function')
    expect(new EqualsBuilder()).to.be.an('object')
  })

  describe('#append', function() {
    context('when all pairs of appended values are equal', function() {
      it('should append the equality comparison for each pair of values', function() {
        var builder = new EqualsBuilder()
        expect(builder.append(123, 123)).to.equal(builder)
        expect(builder.append({
          foo: 'bar',
          fu: function() {
            return 321
          }
        }, {
          foo: 'bar',
          fu: function() {
            return 321
          }
        })).to.equal(builder)

        expect(builder.build()).to.be.true
      })
    })

    context('when a previous pair of appended values are not equal', function() {
      it('should append nothing', function() {
        var builder = new EqualsBuilder()
        expect(builder.append(123, 321)).to.equal(builder)
        expect(builder.append({
          foo: 'bar',
          fu: function() {
            return 321
          }
        }, {
          foo: 'bar',
          fu: function() {
            return 321
          }
        })).to.equal(builder)

        expect(builder.build()).to.be.false
      })
    })
  })

  describe('#appendSuper', function() {
    it('should append super equality result directly', function() {
      var builder = new EqualsBuilder()
      expect(builder.appendSuper(true)).to.equal(builder)
      expect(builder.append('foo', 'foo')).to.equal(builder)

      expect(builder.build()).to.be.true

      builder = new EqualsBuilder()
      expect(builder.appendSuper(false)).to.equal(builder)
      expect(builder.append('foo', 'foo')).to.equal(builder)

      expect(builder.build()).to.be.false
    })

    context('when a previous pair of appended values are not equal', function() {
      it('should append nothing', function() {
        var builder = new EqualsBuilder()
        expect(builder.append('foo', 'bar')).to.equal(builder)
        expect(builder.appendSuper(true)).to.equal(builder)

        expect(builder.build()).to.be.false
      })
    })
  })

  describe('#build', function() {
    it('should return the result of all equality checks', function() {
      var builder = new EqualsBuilder()
      builder.append('foo', 'foo')

      expect(builder.build()).to.be.true

      builder.append(123, 321)

      expect(builder.build()).to.be.false
    })

    context('when no pairs of values are appended', function() {
      it('should return true', function() {
        var builder = new EqualsBuilder()

        expect(builder.build()).to.be.true
      })
    })
  })
})
