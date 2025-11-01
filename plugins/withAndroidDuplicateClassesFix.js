const { withAppBuildGradle } = require('@expo/config-plugins');

const withAndroidDuplicateClassesFix = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = config.modResults.contents.replace(
        'dependencies {',
        `dependencies {
            implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
        `
      );
    }
    return config;
  });
};

module.exports = withAndroidDuplicateClassesFix;
