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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "parenthesis", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "combinedExpression", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => d[0]},
    {"name": "parenthesis", "symbols": ["combinedExpression"], "postprocess": d => d[0]},
    {"name": "combinedExpression", "symbols": ["expression", (lexer.has("and") ? {type: "and"} : and), "expression"], "postprocess": 
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
        }},
    {"name": "combinedExpression", "symbols": ["expression"], "postprocess": d => d[0]},
    {"name": "combinedExpression", "symbols": ["expression", (lexer.has("or") ? {type: "or"} : or), "expression"], "postprocess":  d => {
          return [d[0], d[2]];
        }
                              },
    {"name": "expression", "symbols": [(lexer.has("label") ? {type: "label"} : label), "modifier", "equalityOperation", "param"], "postprocess": 
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
        }},
    {"name": "modifier$ebnf$1", "symbols": []},
    {"name": "modifier$ebnf$1", "symbols": ["modifier$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier$ebnf$2", "symbols": []},
    {"name": "modifier$ebnf$2", "symbols": ["modifier$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "modifier$ebnf$1", "modifierValue", "modifier$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => d[2]},
    {"name": "modifierValue", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": d => d[0].value === 'true' ? true : false},
    {"name": "modifierValue", "symbols": [(lexer.has("modifierKeys") ? {type: "modifierKeys"} : modifierKeys)]},
    {"name": "equalityOperation", "symbols": [(lexer.has("eqOperator") ? {type: "eqOperator"} : eqOperator)]},
    {"name": "equalityOperation", "symbols": [(lexer.has("neOperator") ? {type: "neOperator"} : neOperator)]},
    {"name": "param", "symbols": ["values"]},
    {"name": "param", "symbols": ["singleValue"], "postprocess": d => [[d[0][0].value]]},
    {"name": "values$ebnf$1", "symbols": ["singleValueWithComma"]},
    {"name": "values$ebnf$1", "symbols": ["values$ebnf$1", "singleValueWithComma"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "values", "symbols": [(lexer.has("lbracket") ? {type: "lbracket"} : lbracket), "values$ebnf$1", (lexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": d => d[1].map(d => d[0].value)},
    {"name": "singleValueWithComma$ebnf$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": id},
    {"name": "singleValueWithComma$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "singleValueWithComma$ebnf$2", "symbols": []},
    {"name": "singleValueWithComma$ebnf$2", "symbols": ["singleValueWithComma$ebnf$2", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "singleValueWithComma", "symbols": ["singleValue", "singleValueWithComma$ebnf$1", "singleValueWithComma$ebnf$2"], "postprocess": d => d[0]},
    {"name": "singleValue", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "singleValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)]}
]
  , ParserStart: "parenthesis"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
