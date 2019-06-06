# 'CATEGORY(true)!=123'
@{%
const moo = require("moo");

const lexer = moo.compile({
  WS:     /[ \t]+/,
  lparen:  '(',
  rparen:  ')',
  boolean: ['true', 'false'],
  label: ['CATEGORY', 'BRAND'],
  eqOperator: '==',
  neOperator: '!=',
  number: /[0-9]+/,
  string: /[a-z]+/,
});
%}

@lexer lexer

expression -> %label param equalityOperation value {% d => d.join('') %}
param -> %lparen %WS:* %boolean %WS:* %rparen {% d => d.join('') %} # (true), ( true )
equalityOperation -> %eqOperator | %neOperator # [==, !=]
value -> %string | %number 
# _ -> [ ]:*

# string -> [\w]:+
# number -> [0-9]:+ {%
#     function(d) {
#         return parseInt(d[0].join(''));
#     }
# %}
