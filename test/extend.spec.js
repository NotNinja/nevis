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

var EventEmitter = require('events').EventEmitter;
var expect = require('chai').expect;

var extend = require('../src/extend');

describe('extend:extend', function() {
  var Base;
  var Parent;

  before(function() {
    Base = function() {};
    Base.extend = extend;
    Base.class_ = 'Base';
    Base.super_ = Object;

    Parent = Base.extend('Parent', function(name) {
      this.name = name;
    }, {
      greet: function(name) {
        return 'Hello ' + name + ', my name is ' + this.name;
      }
    }, {
      foo: function() {
        return 'bar';
      }
    });
  });

  it('should be a function', function() {
    expect(extend).to.be.a('function');
  });

  it('should extend the prototype and static properties', function() {
    function ChildConstructor() {
      ChildConstructor.super_.apply(this, arguments);

      this.id = 123;
    }

    var Child = Parent.extend('Child', ChildConstructor, {
      farewell: function(name) {
        return 'Goodbye ' + name;
      }
    }, {
      fizz: function() {
        return 'buzz';
      }
    });
    var child = new Child('Foo');

    expect(Child).to.equal(ChildConstructor);
    expect(child.hasOwnProperty('name')).to.be.true;
    expect(child.name).to.equal('Foo');
    expect(child.id).to.equal(123);
    expect(child.greet('Bar')).to.equal('Hello Bar, my name is Foo');
    expect(child.farewell('Bar')).to.equal('Goodbye Bar');
    expect(Child.foo()).to.equal('bar');
    expect(Child.fizz()).to.equal('buzz');
  });

  it('should only extend own prototype properties', function() {
    function Prototype() {}
    Prototype.prototype.fu = 'baz';
    Prototype.prototype.buzz = function() {
      return 321;
    };

    var proto = new Prototype();
    proto.foo = 'bar';
    proto.fizz = function() {
      return 123;
    };

    var Child = Parent.extend('Child', proto);
    var child = new Child('Foo');

    expect(child.hasOwnProperty('name')).to.be.true;
    expect(child.name).to.equal('Foo');
    expect(child.greet('Bar')).to.equal('Hello Bar, my name is Foo');
    expect(child.foo).to.equal('bar');
    expect(child.fizz()).to.equal(123);
    expect(Child.foo()).to.equal('bar');
  });

  it('should return constructor with correct inheritance', function() {
    var SubParent = Parent.extend('SubParent', function() {
      SubParent.super_.apply(this, arguments);
    });
    var Child = SubParent.extend('Child', function() {
      Child.super_.apply(this, arguments);
    });
    var child = new Child('Foo');

    expect(child).to.be.an.instanceof(Base);
    expect(child).to.be.an.instanceof(Parent);
    expect(child).to.be.an.instanceof(SubParent);
    expect(child).to.be.an.instanceof(Child);
  });

  it('should give constructor class name', function() {
    var SubParent = Parent.extend('SubParent', function() {
      SubParent.super_.apply(this, arguments);
    });
    var Child = SubParent.extend('Child', function() {
      Child.super_.apply(this, arguments);
    });

    expect(Child.class_).to.equal('Child');
    expect(SubParent.class_).to.equal('SubParent');
    expect(Parent.class_).to.equal('Parent');
  });

  it('should give constructor reference to super constructor', function() {
    var SubParent = Parent.extend('SubParent', function() {
      SubParent.super_.apply(this, arguments);
    });
    var Child = SubParent.extend('Child', function() {
      Child.super_.apply(this, arguments);
    });

    expect(Child.super_).to.equal(SubParent);
    expect(SubParent.super_).to.equal(Parent);
    expect(Parent.super_).to.equal(Base);
  });

  it('should allow semi-inheritance of existing classes', function() {
    var Child = Parent.extend('Child', function() {
      Child.super_.apply(this, arguments);

      EventEmitter.call(this);
    }, EventEmitter.prototype, EventEmitter);
    var child = new Child('Foo');

    expect(Child.super_).to.equal(Parent);
    expect(child).to.be.an.instanceof(Object);
    expect(child).to.be.an.instanceof(Base);
    expect(child).to.be.an.instanceof(Parent);
    expect(child).to.be.an.instanceof(Child);
    expect(child).not.to.be.an.instanceof(EventEmitter);
    expect(child.name).to.equal('Foo');
    expect(child.listeners()).to.eql([]);
  });

  context('when no constructor is passed', function() {
    it('should extend the prototype and static properties', function() {
      var Child = Parent.extend('Child', {
        farewell: function(name) {
          return 'Goodbye ' + name;
        }
      }, {
        fizz: function() {
          return 'buzz';
        }
      });
      var child = new Child('Foo');

      expect(child.name).to.equal('Foo');
      expect(child.greet('Bar')).to.equal('Hello Bar, my name is Foo');
      expect(child.farewell('Bar')).to.equal('Goodbye Bar');
      expect(Child.foo()).to.equal('bar');
      expect(Child.fizz()).to.equal('buzz');
    });

    it('should return a constructor with correct inheritance', function() {
      var SubParent = Parent.extend('SubParent');
      var Child = SubParent.extend('Child');
      var child = new Child('Foo');

      expect(child).to.be.an.instanceof(Object);
      expect(child).to.be.an.instanceof(Base);
      expect(child).to.be.an.instanceof(Parent);
      expect(child).to.be.an.instanceof(SubParent);
      expect(child).to.be.an.instanceof(Child);
    });

    it('should return a constructor with reference to super constructor', function() {
      var SubParent = Parent.extend('SubParent');
      var Child = SubParent.extend('Child');

      expect(Child.super_).to.equal(SubParent);
      expect(SubParent.super_).to.equal(Parent);
      expect(Parent.super_).to.equal(Base);
    });

    it('should return a constructor with class name', function() {
      var SubParent = Parent.extend('SubParent');
      var Child = SubParent.extend('Child');

      expect(Child.class_).to.equal('Child');
      expect(SubParent.class_).to.equal('SubParent');
      expect(Parent.class_).to.equal('Parent');
    });

    context('and no name is passed', function() {
      it('should return a constructor with class name of super constructor', function() {
        var SubParent = Parent.extend();
        var Child = SubParent.extend();

        expect(Child.class_).to.equal('Parent');
        expect(SubParent.class_).to.equal('Parent');
        expect(Parent.class_).to.equal('Parent');
      });
    });
  });

  context('when no name is passed', function() {
    it('should give constructor class name of super constructor', function() {
      var SubParent = Parent.extend(function() {
        SubParent.super_.apply(this, arguments);
      });
      var Child = SubParent.extend(function() {
        Child.super_.apply(this, arguments);
      });

      expect(Child.class_).to.equal('Parent');
      expect(SubParent.class_).to.equal('Parent');
      expect(Parent.class_).to.equal('Parent');
    });
  });
});
