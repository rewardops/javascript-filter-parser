import { parseFilterString } from './ro-filter-parser';

const cat1 = 'bulbasaur_1';
const cat2 = 'ivysaur_2';
const cat3 = 'venosaur_3';
const siv1 = 123;
const siv2 = 214;
const siv3 = 980;

test('can parse a category with a single value excluded', () => {
  const filterString = 'CATEGORY(true)!=123';
  const expectedOutput = [
    {
      CATEGORY: {
        excludedWithSubcategories: [123],
      },
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a category with a single value included', () => {
  const filterString = 'CATEGORY(true)=="abc"';
  const expectedOutput = [
    {
      CATEGORY: {
        includedWithSubcategories: ['abc'],
      },
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with an array of values included with subcategories', () => {
  // Strings in the filter definition need to be in quotes
  const filterString = `CATEGORY(true)==["${cat1}", "${cat2}"]`;
  const expectedOutput = [
    {
      CATEGORY: {
        includedWithSubcategories: [cat1, cat2],
      },
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with an array of values included without subcategories', () => {
  const filterString = `CATEGORY(false)==["${cat1}", "${cat2}"]`;

  const expectedOutput = [
    {
      CATEGORY: {
        includedWithoutSubcategories: [cat1, cat2],
      },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with both subcategories included and subcategories excluded', () => {
  // Strings in the filter definition need to be in quotes
  const filterString = `CATEGORY(true)==["${cat1}", "${cat2}"]&CATEGORY(false)==["${cat3}"]`;
  const expectedOutput = [
    {
      CATEGORY: {
        includedWithSubcategories: [cat1, cat2],
        includedWithoutSubcategories: [cat3],
      },
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with two categories included with subcategories joined with an and', () => {
  const filterString = `CATEGORY(true)==["${cat1}", "${cat2}"]&CATEGORY(true)==["${cat3}"]`;
  const expectedOutput = [
    {
      CATEGORY: {
        includedWithSubcategories: [cat1, cat2, cat3],
      },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

// SIV Attributes
test('can parse a filter string with just SIV attributes', () => {
  const filterString = `SIV_ATTRIBUTE(id)==[${siv1},${siv2}]`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        id: {
          included: [siv1, siv2],
        },
      },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with categories and SIVs separated by or(|)', () => {
  const filterString = `CATEGORY(true)==["${cat1}","${cat2}","${cat3}"]|SIV_ATTRIBUTE(id)==[${siv1},${siv2}]`;
  const expectedOutput = [
    {
      CATEGORY: { includedWithSubcategories: [cat1, cat2, cat3] },
    },
    {
      SIV_ATTRIBUTE: { id: { included: [siv1, siv2] } },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a rule with two SIV_ATTRIBUTE props', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(SIV_ATTRIBUTE(id)==[${siv3}])`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        id: {
          excluded: [siv1, siv2],
          included: [siv3],
        },
      },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

// Parenthesis
test('can parse a filter string with & and parenthesis', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1},${siv2}]&(CATEGORY(true)==["${cat1}","${cat2}"])`;
  const expectedOutput = [
    {
      CATEGORY: {
        includedWithSubcategories: [cat1, cat2],
      },
      SIV_ATTRIBUTE: {
        id: {
          excluded: [siv1, siv2],
        },
      },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a single condition surrounded by parenthesis', () => {
  const filterString = '(CATEGORY(true)!=123)';
  const expectedOutput = [
    {
      CATEGORY: {
        excludedWithSubcategories: [123],
      },
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with parenthesis around each condition', () => {
  const filterString = `(CATEGORY(true)==["${cat1}","${cat2}","${cat3}"])|(SIV_ATTRIBUTE(id)==[${siv1},${siv2}])`;
  const expectedOutput = [
    {
      CATEGORY: { includedWithSubcategories: [cat1, cat2, cat3] },
    },
    {
      SIV_ATTRIBUTE: { id: { included: [siv1, siv2] } },
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string with & and a nested or', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}, ${siv2}]&(CATEGORY(true)==["${cat1}","${cat2}"]|SIV_ATTRIBUTE(id)==[${siv3}])`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        id: {
          excluded: [siv1, siv2],
        },
      },
      array: [
        {
          CATEGORY: {
            includedWithSubcategories: [cat1, cat2],
          },
        },
        {
          SIV_ATTRIBUTE: {
            id: {
              included: [siv3],
            },
          },
        },
      ],
    },
  ];

  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string for category codes or siv ids but not including certain siv IDS', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}, ${siv2}]&(CATEGORY(true)==["${cat1}", "${cat2}"]|SIV_ATTRIBUTE(id)==[${siv3}])`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        id: {
          excluded: [siv1, siv2],
        },
      },
      array: [
        {
          CATEGORY: {
            includedWithSubcategories: [cat1, cat2],
          },
        },
        {
          SIV_ATTRIBUTE: {
            id: {
              included: [siv3],
            },
          },
        },
      ],
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string for category codes or siv ids but not including certain siv IDS - swapped order', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}, ${siv2}]&(SIV_ATTRIBUTE(id)==[${siv3}]|CATEGORY(true)==["${cat1}", "${cat2}"])`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        id: {
          excluded: [siv1, siv2],
        },
      },
      array: [
        {
          SIV_ATTRIBUTE: {
            id: {
              included: [siv3],
            },
          },
        },
        {
          CATEGORY: {
            includedWithSubcategories: [cat1, cat2],
          },
        },
      ],
    },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('can parse a filter string for category codes or siv ids but not including certain siv IDS - swapped order', () => {
  const filterString = `SIV_ATTRIBUTE(id)!=[${siv1}, ${siv2}]|(SIV_ATTRIBUTE(id)==[${siv3}]|CATEGORY(true)==["${cat1}", "${cat2}"])`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        id: {
          excluded: [siv1, siv2],
        },
      },
    },
    [
      {
        SIV_ATTRIBUTE: {
          id: {
            included: [siv3],
          },
        },
      },
      {
        CATEGORY: {
          includedWithSubcategories: [cat1, cat2],
        },
      },
    ],
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});
