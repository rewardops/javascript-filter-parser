import { simplifyCategory } from './ro-filter-parser.js';
const cat1 = 'cat_sys_00234';
const cat2 = 'cat_sys_123';
const cat3 = 'cat_sys_cat';

test('return includedWithSubcategories correctly', () => {
  const input = [
    {
      subcategory: true,
      included: [cat1, cat2],
    },
  ];
  const expectedOutput = {
    includedWithSubcategories: [cat1, cat2],
  };
  expect(simplifyCategory(input)).toStrictEqual(expectedOutput);
});

test('returns included with and without subcategories correctly', () => {
  const input = [
    {
      subcategory: true,
      included: [cat1, cat2],
    },
    {
      subcategory: false,
      included: [cat3],
    },
  ];
  const expectedOutput = {
    includedWithSubcategories: [cat1, cat2],
    includedWithoutSubcategories: [cat3],
  };
  expect(simplifyCategory(input)).toStrictEqual(expectedOutput);
});

test('return excludedWithSubcategories correctly', () => {
  const input = [
    {
      subcategory: true,
      excluded: [cat1, cat2],
    },
  ];
  const expectedOutput = {
    excludedWithSubcategories: [cat1, cat2],
  };
  expect(simplifyCategory(input)).toStrictEqual(expectedOutput);
});

