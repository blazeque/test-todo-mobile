module.exports = function (api) {
  api.cache(true);

  if (process.env.JEST_WORKER_ID) {
    return { presets: ['babel-preset-expo'] };
  }

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
