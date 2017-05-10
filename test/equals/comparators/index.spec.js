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

var ArrayEqualsComparator = require('../../../src/equals/comparators/array-comparator');
var CollectionEqualsComparator = require('../../../src/equals/comparators/collection-comparator');
var EqualsComparator = require('../../../src/equals/comparators/comparator');
var comparators = require('../../../src/equals/comparators');
var DateEqualsComparator = require('../../../src/equals/comparators/date-comparator');
var HashEqualsComparator = require('../../../src/equals/comparators/hash-comparator');
var MapEqualsComparator = require('../../../src/equals/comparators/map-comparator');
var NumberEqualsComparator = require('../../../src/equals/comparators/number-comparator');
var ObjectEqualsComparator = require('../../../src/equals/comparators/object-comparator');
var SetEqualsComparator = require('../../../src/equals/comparators/set-comparator');
var StringEqualsComparator = require('../../../src/equals/comparators/string-comparator');
var ToStringEqualsComparator = require('../../../src/equals/comparators/to-string-comparator');

describe('equals/comparators/index', function() {
  it('should contain all equals comparator constructors', function() {
    expect(comparators).to.deep.equal({
      ArrayEqualsComparator: ArrayEqualsComparator,
      CollectionEqualsComparator: CollectionEqualsComparator,
      DateEqualsComparator: DateEqualsComparator,
      EqualsComparator: EqualsComparator,
      HashEqualsComparator: HashEqualsComparator,
      MapEqualsComparator: MapEqualsComparator,
      NumberEqualsComparator: NumberEqualsComparator,
      ObjectEqualsComparator: ObjectEqualsComparator,
      SetEqualsComparator: SetEqualsComparator,
      StringEqualsComparator: StringEqualsComparator,
      ToStringEqualsComparator: ToStringEqualsComparator
    });
  });
});
