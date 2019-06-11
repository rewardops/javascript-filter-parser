# javascript-filter-parser

## Overview

This parser is meant to provide a library with a `parse()` function. This function will consume a filter string of the form:

```js
const filterString =
  "category(true)==['abc','cde']&category(false)==['xyz']&category(true)!=['123']&SIV_ATTRIBUTE(id)==[12,23]&SIV_ATTRIBUTE(id)!=[65,34]";
```

So you should be able to call `Lib.parse(filterString)` and it should return a JSON object of the form:

```js
const filterObject = {
  category: [
    {
      subcategory: true,
      included: ["abc", "cde"]
    },
    {
      subcategory: false,
      included: ["xyz"]
    },
    {
      subcategory: true,
      excluded: ["123"]
    }
  ],
  SIV_ATTRIBUTE: {
    ID: {
      included: [12, 23],
      excluded: [65, 34]
    }
  }
};
```

## Testing

This project implements jest for testing. To run the tests, simply run `npm run test`
