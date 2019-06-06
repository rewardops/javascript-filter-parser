# 'CATEGORY(true)!=123'
@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t]+/,
  lparen:  '(',
  rparen:  ')',
  rbracket: ']',
  lbracket: '[',
  comma: ',',
  boolean: ['true', 'false'],
  label: ['CATEGORY', 'BRAND'],
  eqOperator: '==',
  neOperator: '!=',
  number: /[0-9]+/,
  string: {match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1)}, // slicing the value removes the extra quotes
});
%}

@lexer lexer

expression -> %label argument equalityOperation param {%
  function(data) {
    return {
      [data[0]]: data[3][0]
    }
  }
%}
argument -> %lparen %ws:* %boolean %ws:* %rparen {% d => d.join('') %} # (true), ( true )
equalityOperation -> %eqOperator | %neOperator # [==, !=]
param -> values | singleValue
values -> %lbracket singleValueWithComma:+ %rbracket {% d => d[1].map(d => d[0].value) %} # [2,35,ab]
singleValueWithComma -> singleValue %comma:? %ws:* {% d => d[0] %}
singleValue -> %string | %number {% d => [d[0]] %}

# string -> [\w]:+
# number -> [0-9]:+ {%
#     function(d) {
#         return parseInt(d[0].join(''));
#     }
# %}
