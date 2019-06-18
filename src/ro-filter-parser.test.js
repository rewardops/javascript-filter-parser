import { parseFilterString } from './ro-filter-parser.js';
const cat1 = 'cat_sys_00234';
const cat2 = 'cat_sys_123';
const cat3 = 'cat_sys_cat';

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
  const input = `CATEGORY(true)==["${cat1}", "${cat2}"]`;
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: [cat1, cat2],
      },
    ],
  };
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});

test('parsing a filter string with a list of category codes works', () => {
  const input = `CATEGORY(false)==["${cat1}", "${cat2}"]`;

  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: false,
        included: [cat1, cat2],
      },
    ],
  };

  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});

test('parsing a filter string with both subcategories included and subcategories excluded', () => {
  // Strings in the filter definition need to be in quotes
  const input = `CATEGORY(true)==["${cat1}", "${cat2}"]&CATEGORY(false)==["${cat3}"]`;
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: [cat1, cat2],
      },
      {
        subcategory: false,
        included: [cat3],
      },
    ],
  };
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});
