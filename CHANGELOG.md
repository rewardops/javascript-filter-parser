# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/rewardops/javascript-filter-parser/compare/v0.1.0...v0.2.0)

### Features

- excluded the supplier ([04656c4](https://github.com/rewardops/javascript-filter-parser/commit/04656c4d4547872bfa7faa532f1d1d982d5dfe6c))

### Bug Fixes

- return default empty filter if convertedFilter is null ([464505b](https://github.com/rewardops/javascript-filter-parser/commit/464505b354e68448ab2e70e119d62a59f717a7a5))


## [0.1.0](https://github.com/rewardops/javascript-filter-parser/compare/ebed6e0e08d5752bf2440e0ad14b46fa9f0d5eb5...v0.1.0)

### Features

- included/excluded key functionality ([5933440](https://github.com/rewardops/javascript-filter-parser/commit/5933440c375db17d2c3ccc414783257c14e1e66a))
- handle multiple category definitions ([ac7adf3](https://github.com/rewardops/javascript-filter-parser/commit/ac7adf32ae8e07f61e54ee1fd03aa1e8ae80e126))
- add simplifyCategory function to return an easier to consume array ([edb3ef1](https://github.com/rewardops/javascript-filter-parser/commit/edb3ef1353f2622923dd19bff5ab906933e98bac))
- handle OR conditions and SIVs ([a897893](https://github.com/rewardops/javascript-filter-parser/commit/a897893532b00d344a223323622dcf5a800b6825))
- merge keys which are the same even if they are multiple levels deep ([c6d4925](https://github.com/rewardops/javascript-filter-parser/commit/c6d4925b03a4025c46bbc2a25fcd45bef0e1647d))
- response is always an array ([bb13c74](https://github.com/rewardops/javascript-filter-parser/commit/bb13c747ae652e888b7f62b95a9747bbf1797f63))
- add ability to merge arrays even with recursion ([697557b](https://github.com/rewardops/javascript-filter-parser/commit/697557bf4e6f2893bae4bd7e01185240f7934173))
- enable setFilter for category ([30a9cbd](https://github.com/rewardops/javascript-filter-parser/commit/30a9cbdcc6947aa9779fd610d47b05990b682025))
- handle ANDs correctly ([7efbc54](https://github.com/rewardops/javascript-filter-parser/commit/7efbc548965721c2d72566c0de07316e8efde904))
- set filter correctly extracts out SIV excluded and adds the rest of the filter conditions in an OR ([dbaf5f3](https://github.com/rewardops/javascript-filter-parser/commit/dbaf5f396ae2c7d5643869bd4a760d9ae8339cdc))
- setting SIV excluded working properly ([8bc9dd9](https://github.com/rewardops/javascript-filter-parser/commit/8bc9dd9f5a8862b5099817d13cec6acc063b878d))
- SIV included works correctly ([f733ea5](https://github.com/rewardops/javascript-filter-parser/commit/f733ea56997054d13bc5f4d21ee3023b0a278448))
- supplier added to filter parser. They can be included correctly if not already present ([650cc01](https://github.com/rewardops/javascript-filter-parser/commit/650cc01421704b8f92a17879b72a56e38d54d90d))
- features working correctly with the AND condition ([c58db8a](https://github.com/rewardops/javascript-filter-parser/commit/c58db8acea99e6de81a1c7f33c7104eb61234da3))
- cleaning function also removes empty arrays ([0e96169](https://github.com/rewardops/javascript-filter-parser/commit/0e96169e24ac515f9e421b90f1f91fd3453f5dc1))
- if definition has both ID included and excluded, the excluded are removed ([2b78346](https://github.com/rewardops/javascript-filter-parser/commit/2b783468e578c1b4bf6b5f4e58121a1c8077a5ea))
