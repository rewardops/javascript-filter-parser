@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t]+/,
  lparen:  '(',
  rparen:  ')',
  rbracket: ']',
  lbracket: '[',
  comma: ',',
  and: '&',
  or: '|',
  boolean: ['true', 'false'],
  label: ['CATEGORY', 'BRAND', 'SIV_ATTRIBUTE'],
  modifierKeys: ['id'],
  eqOperator: '==',
  neOperator: '!=',
  number: {match: /[0-9]+/, value: n => parseInt(n, 10) },
  string: {match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1)}, // slicing the value removes the extra quotes
});
%}
@lexer lexer

@{%
  const mergeData = (data0, data2) => {
    if (data0.constructor === Array && data2.constructor === Array) {
      return [...data0, ...data2];
    }
    if (data0.constructor === Object && data2.constructor === Object) {
      return combineKeys(data0, data2);
    }
    if (data0.constructor === Array || data2.constructor === Array) {
      return [data0, data2]
    }
  }

  // combine keys from both the expressions and dedup them.
  const combineKeys = (data0, data2) => {
    const combinedKeys =  Array.from(new Set([...Object.keys(data0), ...Object.keys(data2)]));
    return combinedKeys.reduce((resultObject, key) => {
      if (data0[key] && data2[key]) {
        resultObject[key] = mergeData(data0[key], data2[key]);
      } else if (data0[key]) {
        resultObject[key] = data0[key]
      } else if (data2[key]) {
        resultObject[key] = data2[key]
      }
      return resultObject;
    }, {})
  }
%}

main -> parenthesis {% d => {
  // If the result is a double array, remove the outer array.
  if (d.length === 1 && d[0].constructor === Array) {
    return d[0];
  } else {
    return d;
  }
} %}

parenthesis -> %lparen combinedExpression %rparen {% d => d[1] %} | combinedExpression {% d => d[0] %}

combinedExpression -> parenthesis %and parenthesis {% data => mergeData(data[0], data[2]) %}
                      | expression {% d => d[0] %}
                      | parenthesis %or parenthesis {% d => {
                          return [d[0], d[2]];
                        }
                      %}

expression -> %label modifier equalityOperation param {%
                function(data) {
                  const modifier = data[1];
                  const equality = data[2][0].value;
                  const label = data[0].value;
                  const inclusionKey = equality === '==' ? 'included' : 'excluded';
                  let result = {};
                  if (label === 'CATEGORY') {
                    result[label] = [
                      {
                        subcategory: modifier,
                        [inclusionKey]: data[3][0]
                      }
                    ]
                  }
                  if (label === 'SIV_ATTRIBUTE') {
                    result[label] = {
                      [modifier]: {
                        [inclusionKey]: data[3][0]
                      }
                    }
                  }
                  return result;
                }%}
modifier -> %lparen %ws:* modifierValue %ws:* %rparen {% d => d[2] %} # valid values: (true), ( true )
modifierValue -> %boolean {% d => d[0].value === 'true' ? true : false %}
                | %modifierKeys
equalityOperation -> %eqOperator | %neOperator # valid value: [==, !=]
param -> values | singleValue {% d => [[d[0][0].value]] %}
# param -> values | singleValue {% d => [[d[0][0].value]] %}
values -> %lbracket singleValueWithComma:+ %rbracket {% d => d[1].map(d => d[0].value) %} # [2,35,ab]
singleValueWithComma -> singleValue %comma:? %ws:* {% d => d[0] %}
singleValue -> %string | %number
