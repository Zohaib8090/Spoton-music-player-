module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', "expo-router/babel"],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};