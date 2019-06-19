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

parenthesis -> %lparen combinedExpression %rparen {% d => d[0] %} | combinedExpression {% d => d[0] %}

combinedExpression -> expression %and expression {%
                        function(data) {
                          // combine keys from both the expressions and dedup them.
                          const combinedKeys =  Array.from(new Set([...Object.keys(data[0]), ...Object.keys(data[2])]));
                          return combinedKeys.reduce((resultObject, key) => {
                            let valuesFromFirstExpression = [];
                            let valuesFromSecondExpression = [];
                            // have to handle the case when the values are not actually arrays
                            if (data[0][key] && data[0][key].constructor === Array) {
                              valuesFromFirstExpression = data[0][key];
                            }
                            if (data[2][key] && data[2][key].constructor === Array) {
                              valuesFromSecondExpression = data[2][key];
                            }
                            resultObject[key] = [...valuesFromFirstExpression, ...valuesFromSecondExpression];
                            return resultObject;
                          }, {})
                        }%}
                      | expression {% d => d[0] %}
                      | expression %or expression {% d => {
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
