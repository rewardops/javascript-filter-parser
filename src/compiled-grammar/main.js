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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["parenthesis"], "postprocess":  d => {
          // If the result is a double array, remove the outer array.
          if (d.length === 1 && d[0].constructor === Array) {
            return d[0];
          } else {
            return d;
          }
        } },
    {"name": "parenthesis", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "combinedExpression", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => d[1]},
    {"name": "parenthesis", "symbols": ["combinedExpression"], "postprocess": d => d[0]},
    {"name": "combinedExpression", "symbols": ["parenthesis", (lexer.has("and") ? {type: "and"} : and), "parenthesis"], "postprocess": data => mergeData(data[0], data[2])},
    {"name": "combinedExpression", "symbols": ["expression"], "postprocess": d => d[0]},
    {"name": "combinedExpression", "symbols": ["parenthesis", (lexer.has("or") ? {type: "or"} : or), "parenthesis"], "postprocess":  d => {
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
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
