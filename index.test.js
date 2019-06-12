const RoParser = require('./index');
const categoryCode1 = 'cat_sys_00234';
const categoryCode2 = 'cat_sys_234234';

test('can parse a category with a single value excluded', () => {
  const input = 'CATEGORY(true)!=123';
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        excluded: ['123'],
      },
    ],
  };
  expect(RoParser.parse(input)).toStrictEqual(expectedOutput);
});

test('can parse a category with a single value included', () => {
  const input = 'CATEGORY(true)==123';
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: ['123'],
      },
    ],
  };
  expect(RoParser.parse(input)).toStrictEqual(expectedOutput);
});

test('parsing a filter string with a list of category codes works', () => {
  // Strings in the filter definition need to be in quotes
  const input = `CATEGORY(true)==["${categoryCode1}", "${categoryCode2}"]`;
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: [categoryCode1, categoryCode2],
      },
    ],
  };
  expect(RoParser.parse(input)).toStrictEqual(expectedOutput);
});

test('parsing a filter string with a list of category codes works', () => {
  const input = `CATEGORY(false)==["${categoryCode1}", "${categoryCode2}"]`;

  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: false,
        included: [categoryCode1, categoryCode2],
      },
    ],
  };

  expect(RoParser.parse(input)).toStrictEqual(expectedOutput);
});
