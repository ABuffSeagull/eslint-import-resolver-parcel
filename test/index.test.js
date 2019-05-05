/* eslint-disable no-sync */
const path = require('path');
const fs = require('fs');
const importResolver = require('../src/index.js');

describe('root level', function () {
  test('resolves /test-folder/test-file.js successfully with specifying root dir', function () {
    const source = '/test-folder/test-file';
    const file = __filename;
    const config = { rootDir: 'test' };

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'test-folder/test-file.js'),
    };

    const actual = importResolver.resolve(source, file, config);

    expect(actual).toEqual(expected);
  });
  test('resolves /test/test-file.js successfully', function () {
    const source = '/test/test-file';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'test-file.js'),
    };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });
});

describe('package level', function () {
  test('resolves ~/test/test-file.js with inner node_modules', function () {
    const source = '~/test-file';
    const file = __filename;

    const nodeDir = path.resolve(__dirname, 'node_modules');
    fs.mkdirSync(nodeDir);

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'test-file.js'),
    };

    const actual = importResolver.resolve(source, file);

    fs.rmdirSync(nodeDir);
    expect(actual).toEqual(expected);
  });

  test('resolves ~/index.js with outer node_modules', function () {
    const source = '~/package-test-file';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, '..', 'package-test-file.js'),
    };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });

  test('resolves ~/index.js with outer node_modules inside test-folder', function () {
    const source = '~/package-test-file';
    const file = path.resolve(__dirname, 'test-folder', 'index.js');

    const expected = {
      found: true,
      path: path.resolve(__dirname, '..', 'package-test-file.js'),
    };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });
});

describe('resolve', function () {
  test('resolves ./test-file.js successfully', function () {
    const source = './test-file';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'test-file.js'),
    };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });

  test('resolves index file inside directory successfully', function () {
    const source = './test-folder';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'test-folder/index.js'),
    };

    const actual = importResolver.resolve(source, file);
    expect(actual).toEqual(expected);
  });
  test('resolves core library successfully', function () {
    const source = 'fs';
    const file = __filename;

    const expected = {
      found: true,
      path: null,
    };

    const actual = importResolver.resolve(source, file);
    expect(actual).toEqual(expected);
  });
});

describe('extensions', function () {
  test('resolves another-test-file.ts with extensions successfully', function () {
    const source = './another-test-file';
    const file = __filename;
    const config = { extensions: ['.ts'] };

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'another-test-file.ts'),
    };

    const actual = importResolver.resolve(source, file, config);

    expect(actual).toEqual(expected);
  });
  test('does not resolve another-test-file.ts without extensions', function () {
    const source = './another-test-file';
    const file = __filename;

    const expected = { found: false };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });
  test('resolves jsx-test-file.jsx successfully', function () {
    const source = './jsx-test-file.jsx';
    const file = __filename;
    const expected = {
      found: true,
      path: path.resolve(__dirname, 'jsx-test-file.jsx'),
    };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });
  test('resolves vue-test-file.vue successfully', function () {
    const source = './vue-test-file.vue';
    const file = __filename;
    const expected = {
      found: true,
      path: path.resolve(__dirname, 'vue-test-file.vue'),
    };

    const actual = importResolver.resolve(source, file);

    expect(actual).toEqual(expected);
  });
});

describe('aliases', function () {
  test('resolves package alias successfully', function () {
    const source = 'test-alias';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, '../node_modules/jest/build/jest.js'),
    };

    const actual = importResolver.resolve(source, file);
    expect(actual).toEqual(expected);
  });
  test('resolves folder alias successfully', function () {
    const source = 'folder-alias/test-file.js';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, 'test-folder/test-file.js'),
    };

    const actual = importResolver.resolve(source, file);
    expect(actual).toEqual(expected);
  });
  test('should resolve the correct alias', function () {
    const source = 'foobar';
    const file = __filename;

    const expected = {
      found: true,
      path: path.resolve(__dirname, '../node_modules/jest/build/jest.js'),
    };

    const actual = importResolver.resolve(source, file);
    expect(actual).toEqual(expected);
  });
});
