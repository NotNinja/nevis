/*
 * Copyright (C) 2016 Alasdair Mercer, Skelp
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

var Oopsy = require('../lib/oopsy')

describe('Oopsy', function() {
  it('should be a constructor', function() {
    expect(Oopsy).to.be.a('function')
    expect(new Oopsy()).to.be.an('object')
  })

  describe('.extend', function() {
    var Base = Oopsy.extend(function(name) {
      this.name = name
    }, {
      greet: function(name) {
        return 'Hello ' + name + ', my name is ' + this.name
      }
    }, {
      foo: function() {
        return 'bar'
      }
    })

    it('should extend the prototype and static properties', function() {
      function ChildConstructor() {
        ChildConstructor.super_.apply(this, arguments)

        this.id = 123
      }

      var Child = Base.extend(ChildConstructor, {
        farewell: function(name) {
          return 'Goodbye ' + name
        }
      }, {
        fizz: function() {
          return 'buzz'
        }
      })
      var child = new Child('Foo')

      expect(Child).to.equal(ChildConstructor)
      expect(child.hasOwnProperty('name')).to.be.true
      expect(child.name).to.equal('Foo')
      expect(child.id).to.equal(123)
      expect(child.greet('Bar')).to.equal('Hello Bar, my name is Foo')
      expect(child.farewell('Bar')).to.equal('Goodbye Bar')
      expect(Child.foo()).to.equal('bar')
      expect(Child.fizz()).to.equal('buzz')
    })

    it('should return constructor with correct inheritance', function() {
      var SubBase = Base.extend(function() {
        SubBase.super_.apply(this, arguments)
      })
      var Child = SubBase.extend(function() {
        Child.super_.apply(this, arguments)
      })
      var child = new Child('Foo')

      expect(child).to.be.an.instanceof(Oopsy)
      expect(child).to.be.an.instanceof(Base)
      expect(child).to.be.an.instanceof(SubBase)
      expect(child).to.be.an.instanceof(Child)
    })

    it('should give constructor reference to super constructor', function() {
      var SubBase = Base.extend(function() {
        SubBase.super_.apply(this, arguments)
      })
      var Child = SubBase.extend(function() {
        Child.super_.apply(this, arguments)
      })

      expect(Child.super_).to.equal(SubBase)
      expect(SubBase.super_).to.equal(Base)
      expect(Base.super_).to.equal(Oopsy)
    })

    context('when no constructor is passed', function() {
      it('should extend the prototype and static properties', function() {
        var Child = Base.extend({
          farewell: function(name) {
            return 'Goodbye ' + name
          }
        }, {
          fizz: function() {
            return 'buzz'
          }
        })
        var child = new Child('Foo')

        expect(child.name).to.equal('Foo')
        expect(child.greet('Bar')).to.equal('Hello Bar, my name is Foo')
        expect(child.farewell('Bar')).to.equal('Goodbye Bar')
        expect(Child.foo()).to.equal('bar')
        expect(Child.fizz()).to.equal('buzz')
      })

      it('should return a constructor with correct inheritance', function() {
        var SubBase = Base.extend()
        var Child = SubBase.extend()
        var child = new Child('Foo')

        expect(child).to.be.an.instanceof(Oopsy)
        expect(child).to.be.an.instanceof(Base)
        expect(child).to.be.an.instanceof(SubBase)
        expect(child).to.be.an.instanceof(Child)
      })

      it('should return a constructor with reference to super constructor', function() {
        var SubBase = Base.extend()
        var Child = SubBase.extend()

        expect(Child.super_).to.equal(SubBase)
        expect(SubBase.super_).to.equal(Base)
        expect(Base.super_).to.equal(Oopsy)
      })
    })
  })
})
