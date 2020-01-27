import { posix as path } from 'path';
import fs from 'fs';
import { isCore, sync as resolveSync } from 'resolve';

const defaultExtensions = ['.js', '.jsx'];
export const interfaceVersion = 2;

function findAliases() {
  let currentPath = path.resolve();
  let packagePath = path.resolve(currentPath, 'package.json');
  while (!fs.existsSync(packagePath)) {
    currentPath = path.resolve(currentPath, '..');
    packagePath = path.resolve(currentPath, 'package.json');
  }
  const packageJson = fs.readFileSync(packagePath);
  return JSON.parse(packageJson).alias || {};
}

function resolvePackageLevel(source, file, rootDirectory) {
  let packageDirectory = path.dirname(file);

  for (;;) {
    if (fs.existsSync(path.resolve(packageDirectory, 'node_modules'))) {
      // found node_modules
      break;
    } else if (path.parse(packageDirectory).root === packageDirectory) {
      // reached the drive root, just return null
      return null;
    }
    packageDirectory = path.resolve(packageDirectory, '..');
  }

  return path.join(
    // return rootDirectory if it is nested inside the packageDirectory
    rootDirectory.startsWith(packageDirectory)
      ? rootDirectory
      : packageDirectory,
    // Get rid of the tilde
    source.slice(1),
  );
}

export function resolve(source, file, possibleConfig = {}) {
  if (isCore(source)) return { found: true, path: null };

  const config = { rootDir: '', extensions: [], ...possibleConfig };

  const [startSource] = source.split('/');
  const aliases = findAliases();
  const foundAlias = Object.keys(aliases).find(
    (alias) => alias === startSource,
  );

  let newSource = source.replace(foundAlias, aliases[foundAlias]);

  const rootDirectory = path.resolve(config.rootDir);

  switch (newSource[0]) {
    case '.':
      newSource = path.resolve(path.dirname(file), newSource);
      break;

    case '~':
      newSource = resolvePackageLevel(newSource, file, rootDirectory);
      break;

    case '/':
      newSource = path.join(rootDirectory, newSource);
      break;

    // no default
  }
  try {
    return {
      found: true,
      path: resolveSync(newSource, {
        basedir: path.resolve(),
        extensions: [...defaultExtensions, ...config.extensions],
      }),
    };
  } catch (_) {
    return { found: false };
  }
}
