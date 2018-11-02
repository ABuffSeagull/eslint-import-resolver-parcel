const { parse } = require('@iarna/toml');
const { readFileSync } = require('fs');

const config = parse(readFileSync('.eslintrc.toml'));
config.rules.indent.push({ SwitchCase: 1 });
module.exports = config;
