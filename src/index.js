import path from 'path';
import fs from 'fs';
import { isCore, sync as resolveSync } from 'resolve';

const defaultExtensions = ['.js', '.jsx'];
export const interfaceVersion = 2;

function findAliases() {
  let currentPath = process.cwd();
  let packagePath = path.join(currentPath, 'package.json');
  while (!fs.existsSync(packagePath)) {
    currentPath = path.join(currentPath, '..');
    packagePath = path.join(currentPath, 'package.json');
  }
  const packageJson = fs.readFileSync(packagePath);
  return JSON.parse(packageJson).alias || {};
}

function resolvePackageLevel(source, file) {
  let packageDir = path.dirname(file);
  let isFound = false;
  do {
    if (fs.existsSync(path.resolve(packageDir, 'node_modules'))) isFound = true;
    else if (path.parse(packageDir).root === packageDir) return null;
    // reached the root, just return null
    else packageDir = path.join(packageDir, '..');
  } while (!isFound);
  return path.join(packageDir, source.substring(1)); // get rid of the tilde
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

  const rootDir = path.join(process.cwd(), config.rootDir);

  switch (newSource[0]) {
    case '.':
      newSource = path.join(path.dirname(file), newSource);
      break;

    case '~':
      newSource = resolvePackageLevel(newSource, file) || rootDir;
      break;

    case '/':
      newSource = path.join(rootDir, newSource);
      break;

    // no default
  }
  try {
    return {
      found: true,
      path: resolveSync(newSource, {
        basedir: process.cwd(),
        extensions: [...defaultExtensions, ...config.extensions],
      }),
    };
  } catch (_) {
    return { found: false };
  }
}
