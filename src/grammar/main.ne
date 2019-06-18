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
  label: ['CATEGORY', 'BRAND'],
  eqOperator: '==',
  neOperator: '!=',
  number: /[0-9]+/,
  string: {match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1)}, // slicing the value removes the extra quotes
});
%}

@lexer lexer

combinedExpression -> expression %and expression {%
                        function(data){
                          // combine keys from both the expressions and dedup them.
                          const combinedKeys =  Array.from(new Set([...Object.keys(data[0]), ...Object.keys(data[2])]));

                          return combinedKeys.reduce((resultObject, key) => {
                            let valuesFromFirstExpression = [];
                            let valuesFromSecondExpression = [];
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

expression -> %label modifier equalityOperation param {%
                function(data) {
                  const boolean = data[1] === 'true' ? true : false;
                  const equality = data[2][0].value;
                  const label = data[0].value;
                  const inclusionKey = equality === '==' ? 'included' : 'excluded';
                  let result = {};
                  if (label === 'CATEGORY') {
                    result[label] = [
                      {
                        subcategory: boolean,
                        [inclusionKey]: data[3][0]
                      }
                    ]
                  }
                  return result;
                }%}
modifier -> %lparen %ws:* %boolean %ws:* %rparen {% d => d[2].value %} # valid values: (true), ( true )
equalityOperation -> %eqOperator | %neOperator # valid value: [==, !=]
param -> values | singleValue
values -> %lbracket singleValueWithComma:+ %rbracket {% d => d[1].map(d => d[0].value) %} # [2,35,ab]
singleValueWithComma -> singleValue %comma:? %ws:* {% d => d[0] %}
singleValue -> %string | %number {% d => [d[0].value] %}

    # return {
    #   [data[0]]: data[3][0]
    # }
    # return data[2][0].value;
