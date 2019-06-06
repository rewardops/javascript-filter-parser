// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "expression", "symbols": [(lexer.has("label") ? {type: "label"} : label), "param", "equalityOperation", "value"], "postprocess": d => d.join('')},
    {"name": "param$ebnf$1", "symbols": []},
    {"name": "param$ebnf$1", "symbols": ["param$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "param$ebnf$2", "symbols": []},
    {"name": "param$ebnf$2", "symbols": ["param$ebnf$2", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "param", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "param$ebnf$1", (lexer.has("boolean") ? {type: "boolean"} : boolean), "param$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => d.join('')},
    {"name": "equalityOperation", "symbols": [(lexer.has("eqOperator") ? {type: "eqOperator"} : eqOperator)]},
    {"name": "equalityOperation", "symbols": [(lexer.has("neOperator") ? {type: "neOperator"} : neOperator)]},
    {"name": "value", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "value", "symbols": [(lexer.has("number") ? {type: "number"} : number)]}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
