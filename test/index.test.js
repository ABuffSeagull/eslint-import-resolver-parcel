const importResolver = require('../src/index');
const path = require('path');
const fs = require('fs');

describe('root level', () => {
	test('resolves /test-folder/test-file.js successfully with specifying root dir', () => {
		const source = '/test-folder/test-file';
		const file = __filename;
		const config = {
			rootDir: 'test',
		};

		const expected = {
			found: true,
			path: path.resolve(__dirname, 'test-folder/test-file.js'),
		};

		const actual = importResolver.resolve(source, file, config);

		expect(actual).toEqual(expected);
	});
	test('resolves /test/test-file.js successfully', () => {
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

describe('package level', () => {
	test('resolves ~/test/test-file.js with inner node_modules', () => {
		const source = '~/test-file';
		const file = __filename;

		const node_dir = __dirname + '/node_modules';
		fs.mkdirSync(node_dir);

		const expected = {
			found: true,
			path: path.resolve(__dirname, 'test-file.js'),
		};

		const actual = importResolver.resolve(source, file);

		fs.rmdirSync(node_dir);
		expect(actual).toEqual(expected);
	});

	test('resolves ~/index.js with outer node_modules', () => {
		const source = '~/package-test-file';
		const file = __filename;

		const expected = {
			found: true,
			path: path.resolve(__dirname, '..', 'package-test-file.js'),
		};

		const actual = importResolver.resolve(source, file);

		expect(actual).toEqual(expected);
	});

	test('resolves ~/index.js with outer node_modules inside test-folder', () => {
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

describe('resolve', () => {
	test('resolves ./test-file.js successfully', () => {
		const source = './test-file';
		const file = __filename;

		const expected = {
			found: true,
			path: path.resolve(__dirname, 'test-file.js'),
		};

		const actual = importResolver.resolve(source, file);

		expect(actual).toEqual(expected);
	});

	test('resolves index file inside directory successfully', () => {
		const source = './test-folder';
		const file = __filename;

		const expected = {
			found: true,
			path: path.resolve(__dirname, 'test-folder/index.js'),
		};

		const actual = importResolver.resolve(source, file);
		expect(actual).toEqual(expected);
	});
	test('resolves core library successfully', () => {
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

describe('extensions', () => {
	test('resolves another-test-file.ts with extensions successfully', () => {
		const source = './another-test-file';
		const file = __filename;
		const config = {
			extensions: ['.ts'],
		};

		const expected = {
			found: true,
			path: path.resolve(__dirname, 'another-test-file.ts'),
		};

		const actual = importResolver.resolve(source, file, config);

		expect(actual).toEqual(expected);
	});
	test('does not resolve another-test-file.ts without extensions', () => {
		const source = './another-test-file';
		const file = __filename;

		const expected = {
			found: false,
		};

		const actual = importResolver.resolve(source, file);

		expect(actual).toEqual(expected);
	});
	test('resolves jsx-test-file.jsx successfully', () => {
		const source = './jsx-test-file.jsx';
		const file = __filename;
		const expected = {
			found: true,
			path: path.resolve(__dirname, 'jsx-test-file.jsx'),
		};

		const actual = importResolver.resolve(source, file);

		expect(actual).toEqual(expected);
	});
	test('resolves vue-test-file.vue successfully', () => {
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

describe('aliases', () => {
	test('resolves package alias successfully', () => {
		const source = 'test-alias';
		const file = __filename;

		const expected = {
			found: true,
			path: path.resolve(__dirname, '../node_modules/jest/build/jest.js'),
		};

		const actual = importResolver.resolve(source, file);
		expect(actual).toEqual(expected);
	});
	test('resolves folder alias successfully', () => {
		const source = 'folder-alias/test-file.js';
		const file = __filename;

		const expected = {
			found: true,
			path: path.resolve(__dirname, 'test-folder/test-file.js'),
		};

		const actual = importResolver.resolve(source, file);
		expect(actual).toEqual(expected);
	});
	test('should resolve the correct alias', () => {
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
