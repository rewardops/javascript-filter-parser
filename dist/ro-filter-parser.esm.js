function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/* eslint-disable no-param-reassign */
var categoryTypes = ['includedWithSubcategories', 'includedWithoutSubcategories', 'excludedWithSubcategories', 'excludedWithoutSubcategories'];
function setCategoryCodes(subtype, values) {
  var updatedCat = {};

  if (subtype === 'subcategory-included') {
    updatedCat.includedWithSubcategories = _toConsumableArray(values);
  }

  if (subtype === 'subcategory-excluded') {
    updatedCat.includedWithoutSubcategories = _toConsumableArray(values);
  }

  return updatedCat;
}
function addCategoryCodes(categoryObject, subtype, values) {
  // If the value already exists anywhere in categories, remove it
  categoryTypes.forEach(function (type) {
    if (categoryObject[type]) {
      categoryObject[type] = categoryObject[type].filter(function (value) {
        return !values.includes(value);
      });
    }
  });

  if (subtype === 'subcategory-included') {
    var currentValues = categoryObject.includedWithSubcategories || [];
    categoryObject.includedWithSubcategories = Array.from(new Set([].concat(_toConsumableArray(currentValues), _toConsumableArray(values))));
  }

  if (subtype === 'subcategory-excluded') {
    var _currentValues = categoryObject.includedWithoutSubcategories || [];

    categoryObject.includedWithoutSubcategories = Array.from(new Set([].concat(_toConsumableArray(_currentValues), _toConsumableArray(values))));
  }

  return categoryObject;
}

/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 *
 * If `g` is a curried ternary function and `_` is `R.__`, the following are
 * equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @name __
 * @constant
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */

function _isPlaceholder(a) {
       return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */

/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== 'object') {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.nodeType === 1) {
    return !!x.length;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});

function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */

/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */
function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
}

// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is

/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */

function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b]
 * @param {Array} list The array to consider.
 * @return {Array} The flattened list.
 * @see R.unnest
 * @example
 *
 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */
var flatten = /*#__PURE__*/_curry1( /*#__PURE__*/_makeFlat(true));

/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the key
 * and the values associated with the key in each object, with the result being
 * used as the value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeWithKey(concatValues,
 *                     { a: true, thing: 'foo', values: [10, 20] },
 *                     { b: true, thing: 'bar', values: [15, 35] });
 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
 */
var mergeWithKey = /*#__PURE__*/_curry3(function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
});

/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to the key and associated values
 *   using the resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWithKey, R.mergeDeepWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeDeepWithKey(concatValues,
 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
 */
var mergeDeepWithKey = /*#__PURE__*/_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
  return mergeWithKey(function (k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});

/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                       { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
 */
var mergeDeepRight = /*#__PURE__*/_curry2(function mergeDeepRight(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});

function convertObjectToString(filter) {
  if (filter.constructor === Array) {
    return filter.map(function (f) {
      return "".concat(convertObjectToString(f));
    }).join('|');
  }

  if (filter.constructor === Object) {
    var filterArray = [];

    if (filter.SIV_ATTRIBUTE) {
      var filterStringArray = flatten(Object.keys(filter.SIV_ATTRIBUTE).map(function (type) {
        return Object.keys(filter.SIV_ATTRIBUTE[type]).map(function (subtype) {
          var equalOp = subtype.includes('include') ? '==' : '!=';
          var values = filter.SIV_ATTRIBUTE[type][subtype].map(function (value) {
            return "".concat(value);
          }).join(',');
          return "SIV_ATTRIBUTE(".concat(type, ")").concat(equalOp, "[").concat(values, "]");
        });
      }));
      filterArray.push.apply(filterArray, _toConsumableArray(filterStringArray));
    }

    if (filter.CATEGORY) {
      var CATEGORY = filter.CATEGORY;

      var _filterStringArray = Object.keys(CATEGORY).map(function (key) {
        var equalOp = key.includes('include') ? '==' : '!=';
        var subcategoryOp = key.includes('Without') ? 'false' : 'true';
        var values = CATEGORY[key].map(function (value) {
          return "\"".concat(value, "\"");
        }).join(',');
        return "CATEGORY(".concat(subcategoryOp, ")").concat(equalOp, "[").concat(values, "]");
      });

      filterArray.push(_filterStringArray);
    }

    if (filter.array) {
      filterArray.push(convertObjectToString(filter.array));
    }

    return filterArray.length > 1 ? "(".concat(filterArray.join('&'), ")") : filterArray.join('&');
  }

  return '';
}

function getObjectIndex(filterArray) {
  var result;
  filterArray.forEach(function (f, i) {
    if (JSON.stringify(f) !== '{}') {
      result = i;
    }
  });
  return result;
}

/* eslint-disable no-param-reassign */

function setSivValues(parsedFilter, sivIncluded, subtype, values) {
  var includedIds = sivIncluded ? sivIncluded.SIV_ATTRIBUTE.id.included : [];

  if (subtype === 'id-included') {
    includedIds = values; // Rewrite this so that we don't need param reassign

    parsedFilter.forEach(function (f, index) {
      if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id && parsedFilter[index].SIV_ATTRIBUTE.id.excluded) {
        parsedFilter[index].SIV_ATTRIBUTE.id.excluded = parsedFilter[index].SIV_ATTRIBUTE.id.excluded.filter(function (id) {
          return !values.includes(id);
        });
      } // If all the included values are filtered out, delete SIV_ATTRIBUTE key


      if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id && parsedFilter[index].SIV_ATTRIBUTE.id.excluded && parsedFilter[index].SIV_ATTRIBUTE.id.excluded.length === 0) {
        delete parsedFilter[index].SIV_ATTRIBUTE.id;
      }
    });
  }

  if (subtype === 'id-excluded') {
    var updated = false;

    if (sivIncluded) {
      includedIds = includedIds.filter(function (id) {
        return !values.includes(id);
      });
    }

    parsedFilter.forEach(function (f, index) {
      if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id && parsedFilter[index].SIV_ATTRIBUTE.id.excluded) {
        parsedFilter[index].SIV_ATTRIBUTE.id.excluded = values;
        updated = true;
      }
    });

    if (!updated) {
      var index = getObjectIndex(parsedFilter);
      parsedFilter[index] = mergeDeepRight(parsedFilter[index], {
        SIV_ATTRIBUTE: {
          id: {
            excluded: values
          }
        }
      });
    }
  }

  if (subtype === 'supplier-included') {
    var _index = getObjectIndex(parsedFilter);

    parsedFilter[_index] = mergeDeepRight(parsedFilter[_index], {
      SIV_ATTRIBUTE: {
        supplier: {
          included: values
        }
      }
    });
  }

  var updatedSivIncluded = includedIds.length ? {
    SIV_ATTRIBUTE: {
      id: {
        included: includedIds
      }
    }
  } : null;
  return {
    parsedFilter: parsedFilter,
    updatedSivIncluded: updatedSivIncluded
  };
}

/**
 * This is used to remove any empty objects going through it recursively
 *
 * @export
 * @param {Object} obj
 * @returns {Object}
 *
 * @example
  const test = {
    SIV: {
      id: {},
      incl: [1]
    },
    SIV2: {
      id: {
        included: {}
      }
    }
  }

  cleanObject(test)
  Output: { SIV: { incl: [ 1 ] } }
 */
function cleanObject(obj) {
  var resultObject = {};
  Object.keys(obj).forEach(function (key) {
    if (obj[key].constructor === Object) {
      resultObject[key] = cleanObject(obj[key]);

      if (JSON.stringify(resultObject[key]) === '{}') {
        delete resultObject[key];
      }
    } else {
      resultObject[key] = obj[key];
    }
  });
  return resultObject;
}

function extractSivIncluded(parsedFilter, sivIncluded) {
  var updatedSivIncluded = sivIncluded;
  var updatedFilter = parsedFilter.map(function (filter) {
    if (filter.SIV_ATTRIBUTE && filter.SIV_ATTRIBUTE.id.included) {
      if (updatedSivIncluded) {
        var _updatedSivIncluded$S;

        (_updatedSivIncluded$S = updatedSivIncluded.SIV_ATTRIBUTE.id.included).push.apply(_updatedSivIncluded$S, _toConsumableArray(filter.SIV_ATTRIBUTE.id.included));
      } else {
        updatedSivIncluded = {
          SIV_ATTRIBUTE: {
            id: {
              included: filter.SIV_ATTRIBUTE.id.included
            }
          }
        };
      }

      delete filter.SIV_ATTRIBUTE.id.included;
    }

    if (filter.array) {
      var _extractSivIncluded = extractSivIncluded(filter.array, updatedSivIncluded);

      filter.array = _extractSivIncluded.updatedFilter;
      updatedSivIncluded = _extractSivIncluded.updatedSivIncluded;
      // This is being done only because of the way the current filter definitions are set up where they are wrongly grouped based on the OR.
      // Basically all the current definitions have been slightly wrong but because they were never grouped with anything else, it was not noticable.
      filter.array.forEach(function (f) {
        if (f.CATEGORY) {
          filter.CATEGORY = f.CATEGORY;
        }

        delete f.CATEGORY;
      });
    }

    return filter;
  });
  return {
    updatedFilter: updatedFilter,
    updatedSivIncluded: updatedSivIncluded
  };
}

var nearley = require('nearley');

var grammar = require('../src/compiled-grammar/main');
/**
 * The main function of the library. Parses the filter string to return a JSON object
 *
 * @export
 * @param {string} filterString - the filter string
 * @returns {object} - a json representation of the string
 */


function parseFilterString(filterString) {
  // Create a Parser object from our grammar.
  var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(filterString);
  var results = parser.results;
  if (results.length > 1) return 'Ambigous grammar. Bad!';
  if (results.length === 0) return 'Empty result. Weird!';
  return results[0];
}
function addToFilter(definition, _ref) {
  var label = _ref.label,
      subtype = _ref.subtype,
      values = _ref.values;
  var parsedFilter = parseFilterString(definition);

  switch (label) {
    case 'CATEGORY':
      parsedFilter.forEach(function (filter, index) {
        if (parsedFilter[index].CATEGORY) {
          parsedFilter[index].CATEGORY = addCategoryCodes(filter.CATEGORY, subtype, values);
        }
      });
      break;

    default:
      break;
  }

  return convertObjectToString(parsedFilter);
}
function setFilter(definition, _ref2) {
  var label = _ref2.label,
      subtype = _ref2.subtype,
      values = _ref2.values;
  var parsedFilter = parseFilterString(definition); // SIV ATTRIBUTE Included is a special case where if the value is included that is "ORed" to all the other rules.
  // So we extract it out

  var sivIncluded;

  var _extractSivIncluded = extractSivIncluded(parsedFilter, sivIncluded);

  sivIncluded = _extractSivIncluded.updatedSivIncluded;
  parsedFilter = _extractSivIncluded.updatedFilter;
  parsedFilter.forEach(function (filter, index) {
    if (parsedFilter[index].array) {
      var cleanArray = parsedFilter[index].array.map(function (f) {
        return cleanObject(f);
      }).filter(function (f) {
        return JSON.stringify(f) !== '{}';
      });

      if (cleanArray.length) {
        parsedFilter[index].array = cleanArray;
      } else {
        delete parsedFilter[index].array;
      }
    }
  });

  switch (label) {
    case 'CATEGORY':
      {
        var updated = false;
        parsedFilter.forEach(function (filter, index) {
          if (parsedFilter[index].CATEGORY) {
            parsedFilter[index].CATEGORY = setCategoryCodes(subtype, values);
            updated = true;
          }
        });

        if (!updated) {
          var CATEGORY = setCategoryCodes(subtype, values);
          parsedFilter[0].CATEGORY = CATEGORY;
        }

        break;
      }

    case 'SIV':
      {
        var _setSivValues = setSivValues(parsedFilter, sivIncluded, subtype, values);

        sivIncluded = _setSivValues.updatedSivIncluded;
        parsedFilter = _setSivValues.parsedFilter;
        break;
      }

    default:
      break;
  } // Remove any empty objects (maybe caused by the SIV extraction)


  parsedFilter.forEach(function (filter, index) {
    parsedFilter[index] = cleanObject(parsedFilter[index]);
  });
  parsedFilter = parsedFilter.filter(function (filter) {
    return JSON.stringify(filter) !== '{}';
  });

  if (sivIncluded && parsedFilter.length) {
    parsedFilter.push(sivIncluded);
  }

  var convertedFilter = parsedFilter.length ? parsedFilter : sivIncluded;
  return convertObjectToString(convertedFilter);
}

export { addToFilter, parseFilterString, setFilter };
//# sourceMappingURL=ro-filter-parser.esm.js.map
