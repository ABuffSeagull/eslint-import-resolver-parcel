const toml = require('toml');
const fs = require('fs');

module.exports = toml.parse(fs.readFileSync('.eslintrc.toml'));
