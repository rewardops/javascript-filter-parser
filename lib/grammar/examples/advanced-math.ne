# Example grammar with postprocessor. This will correctly evaluate simple math expressions with the help of the post processor

# Compile with: `nearleyc lib/grammar/examples/advanced-math.ne -o lib/compiled-grammar/examples/advanced-math.js`
# Execute with: `nearley-test lib/compiled-grammar/examples/advanced-math.js --input "2+3*4-1"`
main -> AS {% d => d[0] %}
# Parentheses
P -> "(" AS ")" {% d => d[1] %}
    | N {% d => d[0] %}
# Multiplication and division
MD -> MD "*" P {% d => d[0]*d[2] %}
    | MD "/" P {% d => d[0]/d[2] %}
    | P {% d => d[0] %}
# Addition and subtraction
AS ->
    AS "+" MD {% d => d[0]+d[2] %}
  | AS "-" MD {% d => d[0]-d[2] %}
  | MD {% d => d[0] %}
N ->
    [0-9]:+ {% d => parseInt(d[0].join(''), 10) %}
