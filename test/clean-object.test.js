import cleanObject from '../lib/util/clean-object';

test('works as expected', () => {
  const inputObject = {
    SIV: {
      id: {},
      incl: [1],
    },
    SIV2: {
      id: {
        included: {},
      },
    },
  };
  const expectedOutput = { SIV: { incl: [1] } };
  expect(cleanObject(inputObject)).toStrictEqual(expectedOutput);
});

test('if all the entries are empty', () => {
  const inputObject = {
    SIV: {
      id: {},
      incl: {},
    },
    SIV2: {
      id: {
        included: {},
      },
    },
  };
  const expectedOutput = {};
  expect(cleanObject(inputObject)).toStrictEqual(expectedOutput);
});
