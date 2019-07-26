module.exports = function config (api) {
  const testConfig = { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] };
  return api.env('test') ? testConfig : {};
};
