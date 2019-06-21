import { parseFilterString } from './ro-filter-parser.js';
const cat1 = 'cat_sys_00234';
const cat2 = 'cat_sys_123';
const cat3 = 'cat_sys_cat';
const siv1 = 123;
const siv2 = 214;
const siv3 = 980;

test('can parse a category with a single value excluded', () => {
  const input = 'CATEGORY(true)!=123';
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        excluded: [123],
      },
    ],
  };
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});

test('can parse a category with a single value included', () => {
  const input = 'CATEGORY(true)=="abc"';
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: ['abc'],
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

test('can parse a filter string with just SIV attributes', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1},${siv2}]`;
  const expectedOutput = {
    SIV_ATTRIBUTE: {
      id: {
        included: [siv1, siv2],
      },
    },
  };

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with categories and SIVs separated by or(|)', () => {
  const filterString = `CATEGORY(true)==["${cat1}","${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1},${siv2}]`;
  const expectedOutput = [
    {
      CATEGORY: [{ subcategory: true, included: [cat1, cat2, cat3] }],
    },
    {
      SIV_ATTRIBUTE: { id: { included: [siv1, siv2] } },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with & and parenthesis', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(CATEGORY(true)==["${cat1}","${cat2}"])`;
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        included: [cat1, cat2],
      },
    ],
    SIV_ATTRIBUTE: {
      id: {
        excluded: [siv1, siv2],
      },
    },
  };

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a single condition surrounded by parenthesis', () => {
  const input = '(CATEGORY(true)!=123)';
  const expectedOutput = {
    CATEGORY: [
      {
        subcategory: true,
        excluded: [123],
      },
    ],
  };
  expect(parseFilterString(input)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with parenthesis around each condition', () => {
  const filterString = `(CATEGORY(true)==["${cat1}","${cat2}","${cat3}"])|(SIV_ATTRIBUTE(id)==[${siv1},${siv2}])`;
  const expectedOutput = [
    {
      CATEGORY: [{ subcategory: true, included: [cat1, cat2, cat3] }],
    },
    {
      SIV_ATTRIBUTE: { id: { included: [siv1, siv2] } },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a rule with two SIV_ATTRIBUTE props', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(SIV_ATTRIBUTE(id)==[${siv3}])`;
  const expectedOutput = {
    SIV_ATTRIBUTE: {
      id: {
        excluded: [siv1, siv2],
        included: [siv3],
      },
    },
  };

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});
