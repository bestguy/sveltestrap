const testingConfig = require('./babel.test.config')

module.exports = api => {
  const isTest = api.env('test');

  if(isTest) return testingConfig;

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript'
    ]
  };
};
