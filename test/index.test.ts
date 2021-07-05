import { findAsync, findSync } from '../src/index';
import * as tmp from 'tmp';
import { mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';

tmp.setGracefulCleanup();

describe('findAsync', () => {
  let baseDir: string;
  let base: tmp.DirResult;
  beforeEach(() => {
    base = tmp.dirSync({ prefix: 'new-find-package-json', unsafeCleanup: true });
    baseDir = base.name;
    process.chdir(baseDir);
  });

  it('Should work with defaults', async () => {
    const deeper = path.resolve(baseDir, 'deeper');
    const evenDeeper = path.resolve(deeper, 'more');
    mkdirSync(deeper);
    mkdirSync(evenDeeper);
    process.chdir(evenDeeper);

    const baseFile = path.resolve(baseDir, 'package.json');
    const deeperFile = path.resolve(deeper, 'package.json');
    const evenDeeperFile = path.resolve(evenDeeper, 'definetly-not-package.json');
    writeFileSync(baseFile, 'base');
    writeFileSync(deeperFile, 'deeper');
    writeFileSync(evenDeeperFile, 'not');

    const generator = findAsync(evenDeeper);

    await expect(generator.next()).resolves.toStrictEqual({ done: false, value: deeperFile });
    await expect(generator.next()).resolves.toStrictEqual({ done: false, value: baseFile });
    await expect(generator.next()).resolves.toStrictEqual({ done: true, value: undefined });
  });

  it('Should work with non-defaults', async () => {
    const deeper = path.resolve(baseDir, 'deeper');
    const evenDeeper = path.resolve(deeper, 'more');
    mkdirSync(deeper);
    mkdirSync(evenDeeper);
    process.chdir(evenDeeper);

    const baseFile = path.resolve(baseDir, 'definetly-not-package.json');
    const deeperFile = path.resolve(deeper, 'package.json');
    const evenDeeperFile = path.resolve(evenDeeper, 'package.json');
    writeFileSync(baseFile, 'base');
    writeFileSync(deeperFile, 'deeper');
    writeFileSync(evenDeeperFile, 'not');

    const generator = findAsync(evenDeeper, process.cwd(), 'definetly-not-package.json');

    await expect(generator.next()).resolves.toStrictEqual({ done: false, value: baseFile });
    // await expect(generator.next()).resolves.toStrictEqual({ done: false, value: baseFile });
    await expect(generator.next()).resolves.toStrictEqual({ done: true, value: undefined });
  });

  it('Should work with an for loop', async () => {
    expect.assertions(3);
    const deeper = path.resolve(baseDir, 'deeper');
    const evenDeeper = path.resolve(deeper, 'more');
    mkdirSync(deeper);
    mkdirSync(evenDeeper);
    process.chdir(evenDeeper);

    const baseFile = path.resolve(baseDir, 'package.json');
    const deeperFile = path.resolve(deeper, 'package.json');
    const evenDeeperFile = path.resolve(evenDeeper, 'definetly-not-package.json');
    writeFileSync(baseFile, 'base');
    writeFileSync(deeperFile, 'deeper');
    writeFileSync(evenDeeperFile, 'not');

    let counter = 0;
    for await (const file of findAsync(evenDeeper)) {
      if (counter === 0) {
        expect(file).toStrictEqual(deeperFile);
      }
      if (counter === 1) {
        expect(file).toStrictEqual(baseFile);
      }
      if (counter > 2) {
        throw new Error('Test Failed');
      }

      counter++;
    }
    expect(counter).toStrictEqual(2);
  });
});

describe('findSync', () => {
  let baseDir: string;
  let base: tmp.DirResult;
  beforeEach(() => {
    base = tmp.dirSync({ prefix: 'new-find-package-json', unsafeCleanup: true });
    baseDir = base.name;
    process.chdir(baseDir);
  });

  it('Should work with defaults', () => {
    const deeper = path.resolve(baseDir, 'deeper');
    const evenDeeper = path.resolve(deeper, 'more');
    mkdirSync(deeper);
    mkdirSync(evenDeeper);
    process.chdir(evenDeeper);

    const baseFile = path.resolve(baseDir, 'package.json');
    const deeperFile = path.resolve(deeper, 'package.json');
    const evenDeeperFile = path.resolve(evenDeeper, 'definetly-not-package.json');
    writeFileSync(baseFile, 'base');
    writeFileSync(deeperFile, 'deeper');
    writeFileSync(evenDeeperFile, 'not');

    const generator = findSync(evenDeeper);

    expect(generator.next()).toStrictEqual({ done: false, value: deeperFile });
    expect(generator.next()).toStrictEqual({ done: false, value: baseFile });
    expect(generator.next()).toStrictEqual({ done: true, value: undefined });
  });

  it('Should work with non-defaults', () => {
    const deeper = path.resolve(baseDir, 'deeper');
    const evenDeeper = path.resolve(deeper, 'more');
    mkdirSync(deeper);
    mkdirSync(evenDeeper);
    process.chdir(evenDeeper);

    const baseFile = path.resolve(baseDir, 'definetly-not-package.json');
    const deeperFile = path.resolve(deeper, 'package.json');
    const evenDeeperFile = path.resolve(evenDeeper, 'package.json');
    writeFileSync(baseFile, 'base');
    writeFileSync(deeperFile, 'deeper');
    writeFileSync(evenDeeperFile, 'not');

    const generator = findSync(evenDeeper, process.cwd(), 'definetly-not-package.json');

    expect(generator.next()).toStrictEqual({ done: false, value: baseFile });
    // await expect(generator.next()).resolves.toStrictEqual({ done: false, value: baseFile });
    expect(generator.next()).toStrictEqual({ done: true, value: undefined });
  });

  it('Should work with an for loop', () => {
    expect.assertions(3);
    const deeper = path.resolve(baseDir, 'deeper');
    const evenDeeper = path.resolve(deeper, 'more');
    mkdirSync(deeper);
    mkdirSync(evenDeeper);
    process.chdir(evenDeeper);

    const baseFile = path.resolve(baseDir, 'package.json');
    const deeperFile = path.resolve(deeper, 'package.json');
    const evenDeeperFile = path.resolve(evenDeeper, 'definetly-not-package.json');
    writeFileSync(baseFile, 'base');
    writeFileSync(deeperFile, 'deeper');
    writeFileSync(evenDeeperFile, 'not');

    let counter = 0;
    for (const file of findSync(evenDeeper)) {
      if (counter === 0) {
        expect(file).toStrictEqual(deeperFile);
      }
      if (counter === 1) {
        expect(file).toStrictEqual(baseFile);
      }
      if (counter > 2) {
        throw new Error('Test Failed');
      }

      counter++;
    }
    expect(counter).toStrictEqual(2);
  });
});
