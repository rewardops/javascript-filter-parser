# Simple example grammar showing how an expression is constructed using smaller units.
# This only parses to string to check that its valid. It does not have a preprocessor to manipulate the expression
# Compile with: `nearleyc src/grammar/examples/plusminus.ne -o src/compiled-grammar/examples/plusminus.js`
# Execute with: `nearley-test src/compiled-grammar/examples/plusminus.js --input "2+3-234234"`

# The final expression made of MathSymbols(MS) and Numbers(N)
expression ->
  N MS N MS N  {% d => d.join('') %}
# A math symbol. Can be a '+' or a '-'
MS ->
    "+" {% d => d[0] %}
  | "-" {% d => d[0] %}
# A number. It shows that it can be 0-9 repeated recursively so that it can form any number.
N ->
    null
  | "1" N {% d => d[0] + d[1] %}
  | "2" N {% d => d[0] + d[1] %}
  | "3" N {% d => d[0] + d[1] %}
  | "4" N {% d => d[0] + d[1] %}
  | "5" N {% d => d[0] + d[1] %}
  | "6" N {% d => d[0] + d[1] %}
  | "7" N {% d => d[0] + d[1] %}
  | "8" N {% d => d[0] + d[1] %}
  | "9" N {% d => d[0] + d[1] %}
  | "0" N {% d => d[0] + d[1] %}

