# One of the simplest grammar rules. Statement can be either a 'foo' or a 'bar'. And the main is composed of any number of them put together
# This only parses to string to check that its valid. It does not have a preprocessor to manipulate the expression
# Compile with: `nearleyc src/grammar/examples/simple-test-grammar.ne -o src/compiled-grammar/examples/simple-test-grammar.js`
# Execute with: `nearley-test src/compiled-grammar/examples/simple-test-grammar.js --input "foobarfoobarbarfoo"`

main -> (statement):+ #foobarfoobarbarfoo
statement -> "foo" | "bar"
