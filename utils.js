const readPkg = require('read-pkg');
const pkg = readPkg.sync({ cwd: process.cwd() });

const pkgDeps = Object.keys(pkg.devDependencies || {})
  .concat(Object.keys(pkg.dependencies || {}));

module.exports = {
  enableEslint: pkgDeps.includes('eslint'),
  enableTypescript: pkgDeps.includes('typescript'),
};
