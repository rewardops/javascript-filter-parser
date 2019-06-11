// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "expression", "symbols": [(lexer.has("label") ? {type: "label"} : label), "argument", "equalityOperation", "param"], "postprocess": 
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
        }
        },
    {"name": "argument$ebnf$1", "symbols": []},
    {"name": "argument$ebnf$1", "symbols": ["argument$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "argument$ebnf$2", "symbols": []},
    {"name": "argument$ebnf$2", "symbols": ["argument$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "argument", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "argument$ebnf$1", (lexer.has("boolean") ? {type: "boolean"} : boolean), "argument$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => d[2].value},
    {"name": "equalityOperation", "symbols": [(lexer.has("eqOperator") ? {type: "eqOperator"} : eqOperator)]},
    {"name": "equalityOperation", "symbols": [(lexer.has("neOperator") ? {type: "neOperator"} : neOperator)]},
    {"name": "param", "symbols": ["values"]},
    {"name": "param", "symbols": ["singleValue"]},
    {"name": "values$ebnf$1", "symbols": ["singleValueWithComma"]},
    {"name": "values$ebnf$1", "symbols": ["values$ebnf$1", "singleValueWithComma"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "values", "symbols": [(lexer.has("lbracket") ? {type: "lbracket"} : lbracket), "values$ebnf$1", (lexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": d => d[1].map(d => d[0].value)},
    {"name": "singleValueWithComma$ebnf$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": id},
    {"name": "singleValueWithComma$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "singleValueWithComma$ebnf$2", "symbols": []},
    {"name": "singleValueWithComma$ebnf$2", "symbols": ["singleValueWithComma$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "singleValueWithComma", "symbols": ["singleValue", "singleValueWithComma$ebnf$1", "singleValueWithComma$ebnf$2"], "postprocess": d => d[0]},
    {"name": "singleValue", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "singleValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => [d[0].value]}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
