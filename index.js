const path = require('path');
const fs = require('fs');
const { isCore, sync: resolveSync } = require('resolve');

const defaultExtensions = ['.js', '.jsx', '.vue'];
exports.interfaceVersion = 2;

exports.resolve = function(source, file, config) {
	if (isCore(source)) return { found: true, path: null };

	let rootDir = '';
	if (!!config && !!config.rootDir) rootDir = config.rootDir;
	rootDir = path.resolve(process.cwd(), rootDir);

	switch (source[0]) {
		case '.':
			source = path.dirname(file) + '/' + source;
			break;

		case '~':
			source = resolvePackageLevel(source, file) || rootDir;
			break;

		case '/':
			source = rootDir + '/' + source;
			break;
	}
	try {
		const extensions = config
			? config.extensions || defaultExtensions
			: defaultExtensions;
		return {
			found: true,
			path: resolveSync(source, { extensions }),
		};
	} catch (_) {
		return { found: false };
	}
};

function resolvePackageLevel(source, file) {
	let packageDir = path.dirname(file);
	let isFound = false;
	do {
		if (fs.existsSync(packageDir + '/node_modules')) {
			isFound = true;
		} else if (path.parse(packageDir).root == packageDir) {
			return null; // reached the root, just return null
		} else {
			packageDir = path.resolve(packageDir, '..');
		}
	} while (!isFound);
	return packageDir + '/' + source.substring(1); // get rid of the tilde
}
