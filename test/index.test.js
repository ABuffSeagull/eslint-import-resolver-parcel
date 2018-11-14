const importResolver = require('../index');
const path = require('path');
const { isCore, sync: resolveSync } = require('resolve');

describe('resolve', () => {
  test('resolves ./test-file.js successfully', () => {
    const source = './test-file';
    const file = path.resolve(__dirname + __filename);
    
    const expected = {
      found: true,
      path: path.resolve(__dirname , 'test-file.js'),
    }

    const actual = importResolver.resolve(source, file);
    
    expect(actual).toEqual(expected);
  });
  test('resolves /test-folder/test-file.js successfully', () => {
    const source = '/test-folder/test-file';
    const file = path.resolve(__dirname + __filename);
    const config = {
      rootDir: 'test',
    }
    
    const expected = {
      found: true,
      path: path.resolve(__dirname + '/test-folder/test-file.js'),
    }

    const actual = importResolver.resolve(source, file,config);
    
    expect(actual).toEqual(expected);
  });
});