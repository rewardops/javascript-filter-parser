import deleteEmptyKeys from '../lib/util/delete-empty-keys';

test('removes the empty entries correctly', () => {
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
  expect(deleteEmptyKeys(inputObject)).toStrictEqual(expectedOutput);
});

test('works even if all the entries are empty', () => {
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
  expect(deleteEmptyKeys(inputObject)).toStrictEqual(expectedOutput);
});
