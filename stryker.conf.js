module.exports = function(config) {
  config.set({
    mutator: "javascript",
    packageManager: "yarn",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "jest",
    transpilers: [],
    coverageAnalysis: "off",
    mutate: ["index.js"]
  });
};
