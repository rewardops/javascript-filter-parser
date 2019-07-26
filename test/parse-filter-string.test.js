import { parseFilterString } from '../lib/ro-filter-parser';

const cat1 = 'bulbasaur_1';
const cat2 = 'ivysaur_2';
const cat3 = 'venosaur_3';
const siv1 = 123;
const siv2 = 214;
const siv3 = 980;
const sup1 = 555;
const sup2 = 94;

test('with a single value excluded', () => {
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

test('with a single value included', () => {
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

test('with an array of values included with subcategories', () => {
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

test('with an array of values included without subcategories', () => {
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

test('with both subcategories included and subcategories excluded', () => {
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

test('with two categories included with subcategories joined with an and', () => {
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
test('with just SIV attributes', () => {
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

test('with categories and SIVs separated by or(|)', () => {
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

test('with two SIV_ATTRIBUTE props', () => {
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
test('with & and parenthesis', () => {
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

test('single condition surrounded by parenthesis', () => {
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

test('parenthesis around each condition', () => {
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

test('with & and a nested or', () => {
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

test('Includes CATEGORY, SIV ID - AND - Excludes SIV ID', () => {
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

test('Includes CATEGORY codes, SIV ids - AND - Excludes SIV ids - SIV ID includes is placed first', () => {
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

test('Includes Category code, SIV ID - OR - Excludes SIV ID - SIV ID is placed first', () => {
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

test('with a SIV supplier', () => {
  const filterString = `SIV_ATTRIBUTE(supplier)==[${sup1},${sup2}]`;
  const expectedOutput = [{ SIV_ATTRIBUTE: { supplier: { included: [sup1, sup2] } } }];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('with a SIV supplier OR SIV ID included', () => {
  const filterString = `SIV_ATTRIBUTE(supplier)==[${sup1},${sup2}]|SIV_ATTRIBUTE(id)==[${siv1},${siv3}]`;
  const expectedOutput = [
    { SIV_ATTRIBUTE: { supplier: { included: [sup1, sup2] } } },
    { SIV_ATTRIBUTE: { id: { included: [siv1, siv3] } } },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test('with a SIV supplier AND SIV ID excluded', () => {
  const filterString = `SIV_ATTRIBUTE(supplier)==[${sup1},${sup2}]&SIV_ATTRIBUTE(id)!=[${siv1},${siv3}]`;
  const expectedOutput = [{ SIV_ATTRIBUTE: { supplier: { included: [sup1, sup2] }, id: { excluded: [siv1, siv3] } } }];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});

test.only('with a SIV supplier AND SIV ID excluded AND CATEGORY OR SIV ID included', () => {
  const filterString = `(SIV_ATTRIBUTE(supplier)==[${sup1},${sup2}]&SIV_ATTRIBUTE(id)!=[${siv1},${siv3}]&CATEGORY(true)==["${cat1}"])|SIV_ATTRIBUTE(id)==[${siv2}]`;
  const expectedOutput = [
    {
      SIV_ATTRIBUTE: {
        supplier: { included: [sup1, sup2] },
        id: { excluded: [siv1, siv3] },
      },
      CATEGORY: 123,
    },
    { SIV_ATTRIBUTE: { id: { included: [siv2] } } },
  ];
  expect(parseFilterString(filterString)).toStrictEqual(expectedOutput);
});
