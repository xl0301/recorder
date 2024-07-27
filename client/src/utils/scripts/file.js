/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  "index.js": {
    file: {
      contents: `console.log('1111')`,
    },
  },
  "package.json": {
    file: {
      contents: `
  {
    "name": "example-app",
    "type": "module",
    "dependencies": {
        "rrvideo": "^0.2.1"
    },
    "scripts": {
      "start": "rrvideo --input ../../../../assets/data/data.json"
    }
  }`,
    },
  },
};
