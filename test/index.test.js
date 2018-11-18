const importResolver = require('../index');
const path = require('path');

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
	test('resolves /test-folder/test-file.js successfully', () => {
		const source = '/test-folder/test-file';
		const file = __filename;
		const config = {
			rootDir: 'test',
		};

		const expected = {
			found: true,
			path: path.resolve(__dirname + '/test-folder/test-file.js'),
		};

		const actual = importResolver.resolve(source, file, config);

		expect(actual).toEqual(expected);
	});
	test('resolves another-test-file.ts with extensions successfully', () => {
		const source = './another-test-file';
		const file = __filename;
		const config = {
			extensions: ['.ts'],
		};

		const expected = {
			found: true,
			path: path.resolve(__dirname + '/another-test-file.ts'),
		};

		const actual = importResolver.resolve(source, file, config);

		expect(actual).toEqual(expected);
	});
});
