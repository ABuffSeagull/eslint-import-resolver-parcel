# eslint-import-resolver-parcel

[![Greenkeeper badge](https://badges.greenkeeper.io/ABuffSeagull/eslint-import-resolver-parcel.svg)](https://greenkeeper.io/)

### About
Parcel import resolution plugin for eslint-plugin-import.
This allows for [eslint/import](https://github.com/benmosher/eslint-plugin-import)
to work with parcel's [module resolution](https://parceljs.org/module_resolution.html).

### Installation
```
npm install eslint-import-resolver-parcel -D
```

### Usage
Add this to your eslint config:
```js
settings: {
  'import/resolver': 'parcel'
}
```

### Current status
- [x] Relative paths (`import foo from '../foo.js'`)
- [x] Absolute paths (`import _ from 'lodash'`)
- [x] Tilde paths (`import foo from '~/foo.js'`)
- [x] Root paths* (`import foo from '/foo.js'`)
- [ ] Aliasing

#### *About Root Paths
Because root paths require knowledge of the entry points,
you must pass in the folder where the entry points are located into the config:
```js
settings: {
  'import/resolver': {
    parcel: {
      rootDir: 'src' // wherever your entrypoints are located
    }
  }
}
```
If not specified, it will assume `process.cwd()` (where `eslint` is called from, probably where the `package.json` is located).
