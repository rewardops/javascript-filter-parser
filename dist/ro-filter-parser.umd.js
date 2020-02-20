(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.RoFilterParser = {}));
}(this, function (exports) { 'use strict';

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

  var toString = Object.prototype.toString;
  var _isArguments = /*#__PURE__*/function () {
    return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
      return toString.call(x) === '[object Arguments]';
    } : function _isArguments(x) {
      return _has('callee', x);
    };
  }();

  // cover IE < 9 keys issues
  var hasEnumBug = ! /*#__PURE__*/{ toString: null }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = /*#__PURE__*/function () {

    return arguments.propertyIsEnumerable('length');
  }();

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  /**
   * Returns a list containing the names of all the enumerable own properties of
   * the supplied object.
   * Note that the order of the output array is not guaranteed to be consistent
   * across different JS platforms.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @sig {k: v} -> [k]
   * @param {Object} obj The object to extract properties from
   * @return {Array} An array of the object's own properties.
   * @see R.keysIn, R.values
   * @example
   *
   *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
   */
  var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/_curry1(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /*#__PURE__*/_curry1(function keys(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
    for (prop in obj) {
      if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });

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

  /**
   * Gives a single-word string description of the (native) type of a value,
   * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
   * attempt to distinguish user Object types any further, reporting them all as
   * 'Object'.
   *
   * @func
   * @memberOf R
   * @since v0.8.0
   * @category Type
   * @sig (* -> {*}) -> String
   * @param {*} val The value to test
   * @return {String}
   * @example
   *
   *      R.type({}); //=> "Object"
   *      R.type(1); //=> "Number"
   *      R.type(false); //=> "Boolean"
   *      R.type('s'); //=> "String"
   *      R.type(null); //=> "Null"
   *      R.type([]); //=> "Array"
   *      R.type(/[A-z]/); //=> "RegExp"
   *      R.type(() => {}); //=> "Function"
   *      R.type(undefined); //=> "Undefined"
   */
  var type = /*#__PURE__*/_curry1(function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
  });

  function _arrayFromIterator(iter) {
    var list = [];
    var next;
    while (!(next = iter.next()).done) {
      list.push(next.value);
    }
    return list;
  }

  function _includesWith(pred, x, list) {
    var idx = 0;
    var len = list.length;

    while (idx < len) {
      if (pred(x, list[idx])) {
        return true;
      }
      idx += 1;
    }
    return false;
  }

  function _functionName(f) {
    // String(x => x) evaluates to "x => x", so the pattern may not match.
    var match = String(f).match(/^function (\w*)/);
    return match == null ? '' : match[1];
  }

  // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  function _objectIs(a, b) {
    // SameValue algorithm
    if (a === b) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return a !== 0 || 1 / a === 1 / b;
    } else {
      // Step 6.a: NaN == NaN
      return a !== a && b !== b;
    }
  }

  var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

  /**
   * private _uniqContentEquals function.
   * That function is checking equality of 2 iterator contents with 2 assumptions
   * - iterators lengths are the same
   * - iterators values are unique
   *
   * false-positive result will be returned for comparision of, e.g.
   * - [1,2,3] and [1,2,3,4]
   * - [1,1,1] and [1,2,3]
   * */

  function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);
    var b = _arrayFromIterator(bIterator);

    function eq(_a, _b) {
      return _equals(_a, _b, stackA.slice(), stackB.slice());
    }

    // if *a* array contains any element that is not included in *b*
    return !_includesWith(function (b, aItem) {
      return !_includesWith(eq, aItem, b);
    }, b, a);
  }

  function _equals(a, b, stackA, stackB) {
    if (_objectIs$1(a, b)) {
      return true;
    }

    var typeA = type(a);

    if (typeA !== type(b)) {
      return false;
    }

    if (a == null || b == null) {
      return false;
    }

    if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
      return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
    }

    if (typeof a.equals === 'function' || typeof b.equals === 'function') {
      return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
    }

    switch (typeA) {
      case 'Arguments':
      case 'Array':
      case 'Object':
        if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
          return a === b;
        }
        break;
      case 'Boolean':
      case 'Number':
      case 'String':
        if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
          return false;
        }
        break;
      case 'Date':
        if (!_objectIs$1(a.valueOf(), b.valueOf())) {
          return false;
        }
        break;
      case 'Error':
        return a.name === b.name && a.message === b.message;
      case 'RegExp':
        if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
          return false;
        }
        break;
    }

    var idx = stackA.length - 1;
    while (idx >= 0) {
      if (stackA[idx] === a) {
        return stackB[idx] === b;
      }
      idx -= 1;
    }

    switch (typeA) {
      case 'Map':
        if (a.size !== b.size) {
          return false;
        }

        return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
      case 'Set':
        if (a.size !== b.size) {
          return false;
        }

        return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
      case 'Arguments':
      case 'Array':
      case 'Object':
      case 'Boolean':
      case 'Number':
      case 'String':
      case 'Date':
      case 'Error':
      case 'RegExp':
      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array':
      case 'ArrayBuffer':
        break;
      default:
        // Values of other types are only equal if identical.
        return false;
    }

    var keysA = keys(a);
    if (keysA.length !== keys(b).length) {
      return false;
    }

    var extendedStackA = stackA.concat([a]);
    var extendedStackB = stackB.concat([b]);

    idx = keysA.length - 1;
    while (idx >= 0) {
      var key = keysA[idx];
      if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
        return false;
      }
      idx -= 1;
    }
    return true;
  }

  /**
   * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
   * cyclical data structures.
   *
   * Dispatches symmetrically to the `equals` methods of both arguments, if
   * present.
   *
   * @func
   * @memberOf R
   * @since v0.15.0
   * @category Relation
   * @sig a -> b -> Boolean
   * @param {*} a
   * @param {*} b
   * @return {Boolean}
   * @example
   *
   *      R.equals(1, 1); //=> true
   *      R.equals(1, '1'); //=> false
   *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
   *
   *      const a = {}; a.v = a;
   *      const b = {}; b.v = b;
   *      R.equals(a, b); //=> true
   */
  var equals = /*#__PURE__*/_curry2(function equals(a, b) {
    return _equals(a, b, [], []);
  });

  /**
   * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
   */

  function _isObject(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
  }

  /**
   * Returns the empty value of its argument's type. Ramda defines the empty
   * value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other
   * types are supported if they define `<Type>.empty`,
   * `<Type>.prototype.empty` or implement the
   * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
   *
   * Dispatches to the `empty` method of the first argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.3.0
   * @category Function
   * @sig a -> a
   * @param {*} x
   * @return {*}
   * @example
   *
   *      R.empty(Just(42));      //=> Nothing()
   *      R.empty([1, 2, 3]);     //=> []
   *      R.empty('unicorns');    //=> ''
   *      R.empty({x: 1, y: 2});  //=> {}
   */
  var empty = /*#__PURE__*/_curry1(function empty(x) {
    return x != null && typeof x['fantasy-land/empty'] === 'function' ? x['fantasy-land/empty']() : x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function' ? x.constructor['fantasy-land/empty']() : x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
      return arguments;
    }() : void 0 // else
    ;
  });

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
   * Returns `true` if the given value is its type's empty value; `false`
   * otherwise.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Logic
   * @sig a -> Boolean
   * @param {*} x
   * @return {Boolean}
   * @see R.empty
   * @example
   *
   *      R.isEmpty([1, 2, 3]);   //=> false
   *      R.isEmpty([]);          //=> true
   *      R.isEmpty('');          //=> true
   *      R.isEmpty(null);        //=> false
   *      R.isEmpty({});          //=> true
   *      R.isEmpty({length: 0}); //=> false
   */
  var isEmpty = /*#__PURE__*/_curry1(function isEmpty(x) {
    return x != null && equals(x, empty(x));
  });

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
  /**
   * Returns a category object with values set to the subtype.
   *
   * @export
   * @param {string} subtype
   * @param {Array} values
   * @returns {object} An object with the value set to the right type
   */

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
  /**
   * Returns category object with the value added to the list. If there are existing values, they are preserved.
   *
   * @export
   * @param {object} categoryObject
   * @param {string} subtype
   * @param {array} values
   * @returns {object} Retun the categoryObject with the values appended at the right place
   */

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
   * This function consumes a filter as a JSON object and returns the filter string representation
   *
   * @export
   * @param {object} filter
   * @returns {string} The filter in a string representation
   * @example
   * convertObjectToString({SIV_ATTRIBUTE: {id: included: [123]}})
   * returns: `SIV_ATTRIBUTE(id)==[123]`
   */

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

    deleteEmptyKeys(test)
    Output: { SIV: { incl: [ 1 ] } }
   */

  function deleteEmptyKeys(obj) {
    var resultObject = {};
    Object.keys(obj).forEach(function (key) {
      if (obj[key].constructor === Object) {
        resultObject[key] = deleteEmptyKeys(obj[key]);

        if (isEmpty(resultObject[key])) {
          delete resultObject[key];
        }
      } else if (obj[key].constructor === Array) {
        if (obj[key].length > 0) {
          resultObject[key] = obj[key];
        }
      } else {
        resultObject[key] = obj[key];
      }
    });
    return resultObject;
  }

  /**
   * Function to get the index of the first non empty object in the array. This may need cleanup in the future
   *
   * @export
   * @param {array} filterArray
   * @returns Returns the index of the first non empty object
   */

  function getObjectIndex(filterArray) {
    var result = 0;
    filterArray.forEach(function (f, i) {
      // This can be made faster by defining a function which just checks for non empty
      // instead of cleaning it
      var cleanF = deleteEmptyKeys(f);

      if (!isEmpty(cleanF)) {
        result = i;
      }
    });
    return result;
  }

  /* eslint-disable no-param-reassign */

  /**
   * Handles the logic of setting the SIV values in the right place on the filter
   *
   * @export
   * @param {object} parsedFilter
   * @param {array} sivIncluded
   * @param {string} subtype
   * @param {array} values
   * @returns Return the filter object with the siv values set in the right place
   */

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
      var explicitlyExcludedValues = values.filter(function (value) {
        return !includedIds.includes(value);
      });

      if (sivIncluded) {
        includedIds = includedIds.filter(function (id) {
          return !values.includes(id);
        });
      }

      parsedFilter.forEach(function (f, index) {
        if (parsedFilter[index].SIV_ATTRIBUTE && parsedFilter[index].SIV_ATTRIBUTE.id && parsedFilter[index].SIV_ATTRIBUTE.id.excluded) {
          parsedFilter[index].SIV_ATTRIBUTE.id.excluded = explicitlyExcludedValues;
          updated = true;
        }
      });

      if (!updated) {
        var index = getObjectIndex(parsedFilter);
        parsedFilter[index] = mergeDeepRight(parsedFilter[index], {
          SIV_ATTRIBUTE: {
            id: {
              excluded: explicitlyExcludedValues
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

    if (subtype === 'supplier-excluded') {
      var _index2 = getObjectIndex(parsedFilter);

      parsedFilter[_index2] = mergeDeepRight(parsedFilter[_index2], {
        SIV_ATTRIBUTE: {
          supplier: {
            excluded: values
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
   * Used to extract all the SIV IDs which are included in the filter because they need to be handled differently
   *
   * @export
   * @param {object} parsedFilter
   * @param {array} sivIncluded
   * @returns Returns the parsedFilter object and an array of SIV included IDs
   */
  function extractSivIncluded(parsedFilter, sivIncluded) {
    var updatedSivIncluded = sivIncluded;
    var updatedFilter = parsedFilter.map(function (filter) {
      if (filter.SIV_ATTRIBUTE && filter.SIV_ATTRIBUTE.id && filter.SIV_ATTRIBUTE.id.included) {
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
        // This is being done because of the way the current filter definitions are set up where they are wrongly grouped based on the OR.
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

  var grammar = require('../lib/compiled-grammar/main');
  /**
   * Parses the filter string to return a JSON object
   *
   * @export
   * @param {string} filterString - the filter string
   * @returns {object} - a json representation of the string
   * @example
   *     parseFilterString('CATEGORY(true)!="abc"')
   *     returns: [
   *          {
   *            CATEGORY: {
   *              excludedWithSubCategories: ["abc"]
   *            }
   *          }
   *        ]
   */


  function parseFilterString(filterString) {
    // Create a Parser object from our grammar.
    var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(filterString);
    var results = parser.results;
    if (results.length === 0) return 'Empty result. Weird!';
    return results[0];
  }
  /**
   * Takes a filter string and a json object and updates filter string with the JSON object.
   * Existing values for the quantity being set are blown away
   *
   * @export
   * @param {string} definition
   * @param {object} { label, subtype, values }
   * @returns {string} The filter difinition with the values added to the initial definition
   * @example
   *    setFilter("SIV_ATTRIBUTE(id)=[123]", { label: 'CATEGORY', subtype: 'subcategory-included', values: ["cat1"]})
   *    returns: `CATEGORY(true)==["cat1"]|SIV_ATTRIBUTE(id)==[123]`
   */

  function setFilter(definition, _ref) {
    var label = _ref.label,
        subtype = _ref.subtype,
        values = _ref.values;
    var parsedFilter;

    if (definition !== '') {
      parsedFilter = parseFilterString(definition);
    } else {
      parsedFilter = [{}];
    } // SIV ATTRIBUTE Included is a special case where if the value is included that is "ORed" to all the other rules.
    // So we extract it out


    var sivIncluded;

    var _extractSivIncluded = extractSivIncluded(parsedFilter, sivIncluded);

    sivIncluded = _extractSivIncluded.updatedSivIncluded;
    parsedFilter = _extractSivIncluded.updatedFilter;
    parsedFilter.forEach(function (filter, index) {
      if (parsedFilter[index].array) {
        var cleanArray = parsedFilter[index].array.map(function (f) {
          return deleteEmptyKeys(f);
        }).filter(function (f) {
          return !isEmpty(f);
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


    parsedFilter = parsedFilter.map(function (f) {
      return deleteEmptyKeys(f);
    }).filter(function (filter) {
      return !isEmpty(filter);
    });

    if (sivIncluded && parsedFilter.length) {
      // If the filter has only `SIV_ATTRIBUTE(id)!=[values]`, then ORing it with the IDs is essentially
      // going to return all the items in our system except the excluded ones. Technically correct, but we
      // don't want that. So if its only included and excluded. Remove the excluded.
      if (parsedFilter.length === 1 && Object.keys(parsedFilter[0]).length === 1 && parsedFilter[0].SIV_ATTRIBUTE && Object.keys(parsedFilter[0].SIV_ATTRIBUTE).length === 1 && parsedFilter[0].SIV_ATTRIBUTE.id) {
        parsedFilter = sivIncluded;
      } else {
        parsedFilter.push(sivIncluded);
      }
    }

    var convertedFilter = parsedFilter.length ? parsedFilter : sivIncluded;
    return convertObjectToString(convertedFilter);
  }
  function addToFilter(definition, _ref2) {
    var label = _ref2.label,
        subtype = _ref2.subtype,
        values = _ref2.values;
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

  exports.addToFilter = addToFilter;
  exports.parseFilterString = parseFilterString;
  exports.setFilter = setFilter;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ro-filter-parser.umd.js.map
