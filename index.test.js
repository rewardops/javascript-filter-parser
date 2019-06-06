const parse = require("./index");

test("parsing a category with a single value works", () => {
  const input = "CATEGORY(true)!=123";
  const expectedOutput = {
    CATEGORY: ["123"]
  };
  expect(parse(input)).toStrictEqual(expectedOutput);
});

// const input =
//   'CATEGORY(true)==["cat_sys_000061","cat_sys_000029","cat_sys_000021","cat_sys_000022","cat_sys_000028","cat_sys_000072","cat_sys_000060","cat_sys_000062","cat_sys_000063","cat_sys_000064","cat_sys_000077","cat_sys_000065","cat_sys_000066","cat_sys_000067","cat_sys_000075","cat_sys_000073","cat_sys_000076","cat_sys_000074","cat_sys_001167","cat_sys_000031","cat_sys_000054","cat_sys_000019","cat_sys_000030","cat_sys_000032","cat_sys_000033","cat_sys_000034","cat_sys_000035","cat_sys_000037","cat_sys_000039","cat_sys_000040","cat_sys_000041","cat_sys_000042","cat_sys_000043","cat_sys_000055","cat_sys_000049","cat_sys_000050","cat_sys_000051","cat_sys_000052","cat_sys_000053","cat_sys_000056","cat_sys_000038","cat_sys_000020","cat_sys_000024","cat_sys_000025","cat_sys_000026","cat_sys_000027","cat_sys_000023","cat_sys_000044","cat_sys_000046","cat_sys_000018","cat_sys_000007","cat_sys_000808","cat_sys_000048","cat_sys_000036","cat_sys_000059"]';

// const input2 = 'CATEGORY(true)==["cat_sys_00234", "cat_sys_234234"]';
