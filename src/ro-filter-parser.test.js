import { parseFilterString } from './ro-filter-parser.js';
const categoryCode1 = 'cat_sys_00234';
const categoryCode2 = 'cat_sys_123';
const categoryCode3 = 'cat_sys_cat';

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
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
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
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
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
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
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

  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});

test('parsing a filter string with both subcategories included and subcategories excluded', () => {
  // Strings in the filter definition need to be in quotes
  const input = `CATEGORY(true)==["${categoryCode1}", "${categoryCode2}"]&CATEGORY(false)==["${categoryCode3}"]`;
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: [categoryCode1, categoryCode2],
      },
      {
        subcategory: false,
        included: [categoryCode3],
      },
    ],
  };
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});
