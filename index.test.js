const parse = require("./index");

test("parsing a category with a single value works", () => {
  const input = "CATEGORY(true)!=123";
  const expectedOutput = {
    CATEGORY: ["123"]
  };
  expect(parse(input)).toStrictEqual(expectedOutput);
});

test("parsing a filter string with a list of category codes works", () => {
  const categoryCode1 = "cat_sys_00234";
  const categoryCode2 = "cat_sys_234234";
  // Strings in the filter definition need to be in quotes
  const input = `CATEGORY(true)==["${categoryCode1}", "${categoryCode2}"]`;
  const expectedOutput = {
    CATEGORY: [categoryCode1, categoryCode2]
  };
  expect(parse(input)).toStrictEqual(expectedOutput);
});
