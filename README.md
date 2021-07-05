# new-find-package-json

Inspired by [`find-package-json`](https://github.com/3rd-Eden/find-package-json)

This package can file (by default) the nearest `package.json` upwards.

## Usage

```ts
const findFileFrom = process.cwd();
for await (const file of find(findFileFrom)) {
  console.log("found file:", file);
}
```

Note: it is important to not forget to use `for await..of` instead of just `for..of`

### Options

Options for `find`:

| Index | Name | Type | Default | Description |
| :---: | :---: | :---: | :---: | :---: |
| 0 | `input` | `string` | none (required) | The path to search from |
| 1 | `base` | `string` | `process.cwd()` | The path to use as an absolute point if `input` is not absolute |
| 2 | `fileName` | `string` | `package.json` | The Filename to search for |

`.next` will return an object with `value` and `done`, where value is the absolute path to the file found and `undefined` if `done` is `true`
