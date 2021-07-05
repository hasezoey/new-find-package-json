import * as path from 'path';
import { promises as fsPromises, Stats } from 'fs';
import * as debug from 'debug';

const log = debug('new-find-package-json:main');

/**
 * Find "package.json" files, starting from "input"
 * @param input Input Path to start searching from
 * @param base Base path, combined with input to form an absolute path (default: `process.cwd()`)
 * @param fileName The filename to search for (default: `package.json`)
 */
export async function* find(input: string, base?: string, fileName?: string): AsyncGenerator<string, void, void> {
  log(`findSync: called with "${input}" and "${base}" and "${fileName}"`);

  base = !!base ? base : '';
  const useFileName = !!fileName ? fileName : 'package.json';
  const useBase = !!base || path.isAbsolute(base) ? base : process.cwd();
  let testPath = path.resolve(useBase, input);
  let wasRoot = false;

  while (testPath) {
    // Exectue search for "package.json" even on "/" | "C:"
    if (testPath === path.parse(testPath).root) {
      wasRoot = true;
    }

    const testFile = path.resolve(testPath, useFileName);
    log(`findSync: testing path "${testFile}"`);
    const result = await statPath(testFile);

    if (!!result && result.isFile()) {
      log(`findSync: path exists and is file "${testFile}"`);
      yield testFile;
      log(`findSync: after yield`);
    }

    // stop looping after having searched root, because there is no more going up
    if (wasRoot) {
      break;
    }

    testPath = path.resolve(testPath, '..');
  }
}

/**
 * Run "fs.promises.stat", but return "undefined" if error is "ENOENT"
 * follows symlinks
 * @param path The Path to Stat
 * @throws if the error is not "ENOENT"
 */
async function statPath(path: string): Promise<Stats | undefined> {
  return fsPromises.stat(path).catch((err) => {
    if (err.code === 'ENOENT') {
      return undefined; // catch the error if the directory dosnt exist, without throwing an error
    }

    throw err;
  });
}
