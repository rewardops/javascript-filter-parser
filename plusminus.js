// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "expression", "symbols": ["N", "MS", "N", "MS", "N"], "postprocess": d => d.join('')},
    {"name": "MS", "symbols": [{"literal":"+"}], "postprocess": d => d[0]},
    {"name": "MS", "symbols": [{"literal":"-"}], "postprocess": d => d[0]},
    {"name": "N", "symbols": []},
    {"name": "N", "symbols": [{"literal":"1"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"2"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"3"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"4"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"5"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"6"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"7"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"8"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"9"}, "N"], "postprocess": d => d[0] + d[1]},
    {"name": "N", "symbols": [{"literal":"0"}, "N"], "postprocess": d => d[0] + d[1]}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
