
const { withAppBuildGradle } = require('@expo/config-plugins');

const withAndroidDuplicateClassesFix = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = config.modResults.contents + `
configurations.all {
    exclude group: 'com.android.support', module: 'support-v4'
    exclude group: 'com.android.support', module: 'support-compat'
}
`;
    }
    return config;
  });
};

module.exports = withAndroidDuplicateClassesFix;
