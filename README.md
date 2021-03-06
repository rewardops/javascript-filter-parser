# Table of Contents

- [Working on the parser](#working-on-the-parser)
  - [Compiling the Grammar to generate the parser](#compiling-the-grammar-to-generate-the-parser)
  - [Testing in the terminal](#testing-in-the-terminal)
- [Library Specification](#library-specification)
- [parseFilterString(filterString) ⇒ object](#parsefilterstringfilterstring--object)
  - [Category Filter With Subcategories](#category-filter-with-subcategories)
    - [Adding categories](#adding-categories)
    - [Removing categories](#removing-categories)
  - [Category Filter Without Subcategories](#category-filter-without-subcategories)
  - [Other Example Filter Strings](#other-example-filter-strings)
    - [Items belonging to category codes or certain item IDs](#items-belonging-to-category-codes-or-certain-item-ids)
    - [Items belonging to category codes but not including certain item IDs](#items-belonging-to-category-codes-but-not-including-certain-item-ids)
    - [Items belonging to category codes or item IDs but not including certain item IDs](#items-belonging-to-category-codes-or-item-ids-but-not-including-certain-item-ids)
- [setFilter(definition, { label,subtype,values }) ⇒ string](#setfilterdefinition--labelsubtypevalues---string)
  - [CATEGORY](#category)
    - [subcategory-included](#subcategory-included)
    - [subcategory-excluded](#subcategory-excluded)
  - [SIV_ATTRIBUTE](#siv_attribute)
    - [id-included (<em>special case</em>)](#id-included-special-case)
    - [id-excluded](#id-excluded)
    - [supplier-included](#supplier-included)
- [Testing](#testing)

# Working on the parser

This project uses the parser generator by [ Nearley.js ](https://nearley.js.org/). To work on the grammar and to modify the rules, you will need to have Nearley installed on your machine. To achieve that run:

```js
npm install -g nearley
```

There are a few example grammar files provided in the folder `lib/grammar/examples`. Going through these might give the reader an understanding of the grammar syntax and the grammar examples also include instructions on how to test them.

## Compiling the Grammar to generate the parser

The main file containing the grammar rules is stored in `lib/grammar/main.ne`. Whenever the file is updated, you need to compile it to generate the parser js file. To do this run:

```js
nearleyc lib/grammar/main.ne -o lib/compiled-grammar/main.js
```

This will generate the parser file `main.js` which is used by this library.

## Testing in the terminal

If you want to test the generated parser file against a particular output in the terminal without running the tests through jest, you can run:

```js
nearley-test lib/compiled-grammar/main.js --input 'CATEGORY(true)=="abc"'
```

# Library Specification

There are two main functions returned from the library with the following signatures:

<dl>
<dt><a href="#parseFilterString">parseFilterString(filterString)</a> ⇒ <code>object</code></dt>
<dd><p>Parses the filter string to return a JSON object</p>
</dd>
<dt><a href="#setFilter">setFilter(definition, { label,subtype,values })</a> ⇒ <code>string</code></dt>
<dd><p>Takes a filter string and a json object and updates filter string with the JSON object.
Existing values for the quantity being set are blown away</p>
</dd>
</dl>

<a name="parseFilterString"></a>

# parseFilterString(filterString) ⇒ <code>object</code>

Parses the filter string to return a JSON object

**Kind**: global function
**Returns**: <code>object</code> - - a json representation of the string

| Param        | Type                | Description       |
| ------------ | ------------------- | ----------------- |
| filterString | <code>string</code> | the filter string |

**Example**

```js
parseFilterString('CATEGORY(true)==["abc","cde"]&CATEGORY(false)==["xyz"]&CATEGORY(true)!=["123"]&SIV_ATTRIBUTE(id)==[12,23]&SIV_ATTRIBUTE(id)!=[65,34]')

-> returns: [
  {
    CATEGORY: {
      includedWithSubcategories: ['abc', 'cde'],
      includedWithoutSubcategories: ['xyz'],
      excludedWithSubcategories: ['123'],
    },
    SIV_ATTRIBUTE: {
      id: {
        included: [12, 23],
        excluded: [65, 34],
      },
    },
  },
];
```

If we break it down to smaller chunks, we get:

## Category Filter With Subcategories

These are definitions where including a parent category automatically includes all its subcategories to the filter. In the filter string they are represented by the boolean in the parenthesis immediately after the keyword `CATEGORY`. For example in the category string `CATEGORY(true)==['CAT_SYS_123']`, the `true` indicates that all the subcategories are included.

These can be further divided into two types:

### Adding categories

These filter strings are used to show the category codes which are added to the filter. These are filter strings of the form:

```js
const filterString = 'CATEGORY(true)==["abc", "cde"]';
```

The resulting JSON for this string should look like:

```js
const filterArray = [
  {
    CATEGORY: {
      includedWithSubcategories: ['abc', 'cde'],
    },
  },
];
```

### Removing categories

Very similar to the previous example but these strings denote category codes which are explicitly removed from the filter. Currently, these filter strings do not exist in the actual data but strings like these are possible. These are filter strings of the form:

```js
const filterString = 'CATEGORY(true)!=["xyz", "pyf"]';
```

Note that the equality operator here is `!=` and not `==`.

The resulting JSON for this string should look like:

```js
const filterArray = [
  {
    CATEGORY: {
      excludedWithSubcategories: ['xyz', 'pyf'],
    },
  },
];
```

The key here is called `excluded` as opposed to `included` in the previous example.

## Category Filter Without Subcategories

A category filter definition where adding or excluding a category only applies to items marked with that particular category and items marked with categories which are subcategories to the category mentioned in the definition are unaffected by this filter rule. An example of a filter string of this type would be `CATEGORY(false)==['CAT_123']` and here the boolean `false` next to the category indicates that the subcategories are not included in the definition. These have the same 2 types as the definitions where the subcategories are included:

- Adding Categories
- Removing Categories

They look exactly like their counterparts where the subcategories are included except for the boolean flag. For example, a filter string of this type where you are adding the categories would look like:

```js
const filterString = 'CATEGORY(false)==["abc", "cde"]';
```

The parsed JSON object for this string would be:

```js
const filterArray = [
  {
    CATEGORY: {
      includedWithoutSubcategories: ['abc', 'cde'],
    },
  },
];
```

The only difference here being that the boolean value for the key `subcategory` is `false`.

## Other Example Filter Strings

### Items belonging to category codes or certain item IDs

```js
const filterString = 'CATEGORY(false)==["abc", "cde"]|SIV_ATTRIBUTE(id)==[123, 432]';
```

The parsed JSON object for this string would be:

```js
const filterArray = [
  {
    CATEGORY: {
      includedWithoutSubcategories: ['abc', 'cde'],
    },
  },
  {
    SIV_ATTRIBUTE: {
      id: {
        included: [123, 432],
      },
    },
  },
];
```

### Items belonging to category codes but not including certain item IDs

```js
const filterString = 'SIV_ATTRIBUTE(id)==[123, 432]&(CATEGORY(true)==["pikachu", "raichu"])';
```

The parsed JSON object for this string would be:

```js
const filterArray = [
  {
    CATEGORY: {
      includedWithSubcategories: ['pikachu', 'raichu'],
    },
    SIV_ATTRIBUTE: {
      id: {
        excluded: [123, 432],
      },
    },
  },
];
```

### Items belonging to category codes or item IDs but not including certain item IDs

```js
const filterString = 'SIV_ATTRIBUTE(id)!=[123, 432]&(CATEGORY(true)==["pikachu", "raichu"]|SIV_ATTRIBUTE(id)==[98])';
```

The parsed JSON object for this string would be:

```js
const filterArray = [
  {
    SIV_ATTRIBUTE: {
      id: {
        excluded: [123, 432],
      },
    },
    array: [
      {
        CATEGORY: {
          includedWithSubcategories: ['pikachu', 'raichu'],
        },
      },
      {
        SIV_ATTRIBUTE: {
          id: {
            included: [98],
          },
        },
      },
    ],
  },
];
```

<a name="setFilter"></a>

# setFilter(definition, { label,subtype,values }) ⇒ <code>string</code>

Takes a filter string and a json object and updates filter string with the JSON object.
Existing values for the quantity being set are blown away.

**Kind**: global function
**Returns**: <code>string</code> - The filter difinition with the values added to the initial definition.

| Param                      | Type                | Description                                                               |
| -------------------------- | ------------------- | ------------------------------------------------------------------------- |
| definition                 | <code>string</code> | The filter definition to be modified                                      |
| { label, subtype, values } | <code>object</code> | An object which specifies what to set on the filter and the values to set |

**Example**

```js
setFilter("SIV_ATTRIBUTE(id)=[123]", { label: 'CATEGORY', subtype: 'subcategory-included', values: ["cat1"]})

-> `CATEGORY(true)==["cat1"]|SIV_ATTRIBUTE(id)==[123]`
```

The currently supported labels and the valid subtypes are in this chart.

| Label           | Valid Subtypes                                    |
| --------------- | ------------------------------------------------- |
| `CATEGORY`      | `subcategory-included`, `subcategory-excluded`    |
| `SIV_ATTRIBUTE` | `id-included`, `id-excluded`, `supplier-included` |

The following section explains each of these label subtype combinations in further detail with examples.

## CATEGORY

### `subcategory-included`

Used to update or set category codes which are to be included in the filter string _**including** their subcategories_. Say the filter initially includes all items with the category code `electronics` and its subcategories. You want to change the filter to include all items which belong to category codes `electricals` and `home-appliances` and their subcategories.

```js
const initialDefinition = 'CATEGORY(true)==["electronics"]';

setFilter(initialDefintion, { label: 'CATEGORY', subtype: 'subcategory-included', values: ["electricals", "home-appliances"]});

-> 'CATEGORY(true)==["electricals", "home-appliances"]'
```

The initial value can also be a filter string not containing category. Say the initial filter was all items belonging to the supplier `Apple`. And we wanted to add the same 2 category codes to this filter string.

```js
const initialDefinition = `SIV_ATTRIBUTE(supplier)==["Apple"]`;

setFilter(initialDefintion, { label: 'CATEGORY', subtype: 'subcategory-included', values: ["electricals", "home-appliances"]});

-> `SIV_ATTRIBUTE(supplier)==["Apple"]&CATEGORY(true)==["electricals", "home-appliances"]`
```

### `subcategory-excluded`

Used to update or set category codes which are to be included in the filter string _**excluding** their subcategories_. Say the filter initially includes all items with the category code `electronics` and its subcategories. You want to change the filter to include all items which belong to category codes `electronics2` and `home-appliances` but not their subcategories.

```js
const initialDefinition = 'CATEGORY(true)==["electronics"]';

setFilter(initialDefintion, { label: 'CATEGORY', subtype: 'subcategory-excluded', values: ["electronics2", "home-appliances"]});

-> 'CATEGORY(false)==["electronics2", "home-appliances"]'
```

## SIV_ATTRIBUTE

### `id-included` (_special case_)

We use this to create a filter which includes all the SIV IDs provided. This is a special case because the other filter strings are all inclusive. For example, your filter may try to get all items belonging to a particular category, say Electronics **AND** is supplied by a particular supplier, say Apple. But in the case of SIV IDs, it is the other conditions **OR** all items with these IDs. It is not an **AND** relationship.

```js
const initialDef = 'CATEGORY(true)==["electronics"]&SIV_ATTRIBUTE(supplier)==["Apple"]'

setFilter(initialDef, { label: 'SIV', subtype: 'id-included', values: [123]})

->  '(CATEGORY(true)==["electronics"]&SIV_ATTRIBUTE(supplier)==["Apple"])|SIV_ATTRIBUTE(id)==[123]'
```

Note: The resulting filter is joined with an **"|"** which denotes that its an **OR** condition.

### `id-excluded`

If you want to select all items belonging to a particular filter **except** for a few IDs, thats when you use this rule. This will specify a set of SIV ID values to exclude from the filter.

```js
const initialDef = 'CATEGORY(true)==["electronics"]&SIV_ATTRIBUTE(supplier)==["Apple"]'

setFilter(initialDef, { label: 'SIV', subtype: 'id-excluded', values: [123]})

->  '(CATEGORY(true)==["electronics"]&SIV_ATTRIBUTE(supplier)==["Apple"]&SIV_ATTRIBUTE(id)!=[123])'
```

Note the difference from the previous filter string. The IDs are denoted with a **"!="** sign and they are joined with an **&** to denote that this rule works with the existing rules.

NOTE: Another thing to note is that currently, you cannot have a filter definiton with only ID excluded and ID included. In that case, all the ID excluded entries are automatically removed. 

### `supplier-included`

If you have a particular filter but if you want to restrict the filter result only to a list of suppliers, you will use this subtype. For example, say the filter currently returns all items belonging to the category electronics, but you want to just look at the items under electronics provided by the amazing supplier rewardos and say the supplier ID of rewardos was 1.

```js
const initialDef = 'CATEGORY(true)==["electronics"]'

setFilter(initialDef, { label: 'SIV', subtype: 'supplier-included', values: [1]})

->  '(CATEGORY(true)==["electronics"]&SIV_ATTRIBUTE(supplier)==[1])'
```

### `supplier-excluded`

If you have a particular filter but if you want to restrict the filter result only to exclude a list of suppliers, you will use this subtype. For example, say the filter currently returns all items belonging to the category electronics, but you want to just look at all the items under electronics except items provided by the amazing supplier rewardos and say the supplier ID of rewardos was 1.

```js
const initialDef = 'CATEGORY(true)==["electronics"]'

setFilter(initialDef, { label: 'SIV', subtype: 'supplier-excluded', values: [1]})

->  '(CATEGORY(true)==["electronics"]&SIV_ATTRIBUTE(supplier)!=[1])'

```
# Testing

This project implements jest for testing. To run the tests, simply run

```js
npm run test
```

## Running tests in debug mode

You can add debugger in your code and run your tests in debug mode by running:

```js
npm run test:debug
```

It will start the test in debug mode. And then you can go to chrome and go to the inspect tab: `chrome://inspect`, and you will see the debug session under _Remote Targets_. Click on it and it will open another chrome tab with the test running in a debugger. Once the test completes running, you need to close the chrome debug tab for the test to end on the terminal.

More details are here: [ Jest Troubleshooting ](https://jestjs.io/docs/en/troubleshooting)
