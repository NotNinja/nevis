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

var ArrayEqualsComparator = require('./array-comparator');
var CollectionEqualsComparator = require('./collection-comparator');
var DateEqualsComparator = require('./date-comparator');
var EqualsComparator = require('./comparator');
var HashEqualsComparator = require('./hash-comparator');
var MapEqualsComparator = require('./map-comparator');
var NumberEqualsComparator = require('./number-comparator');
var ObjectEqualsComparator = require('./object-comparator');
var SetEqualsComparator = require('./set-comparator');
var StringEqualsComparator = require('./string-comparator');
var ToStringEqualsComparator = require('./to-string-comparator');

/**
 * A hash containing constructors for all equals comparators.
 *
 * @public
 * @type {Object.<string, Function>}
 */
module.exports = {
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
};
