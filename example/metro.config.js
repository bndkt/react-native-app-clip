// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// npm v7+ will install ../node_modules/react and ../node_modules/react-native because of peerDependencies.
// To prevent the incompatible react-native between ./node_modules/react-native and ../node_modules/react-native,
// excludes the one from the parent folder when bundling.
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  new RegExp(path.resolve('..', 'node_modules', 'react')),
  new RegExp(path.resolve('..', 'node_modules', 'react-native')),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, './node_modules'),
  path.resolve(__dirname, '../node_modules'),
];

config.resolver.extraNodeModules = {
  'react-native-app-clip': '..',
};

config.watchFolders = [path.resolve(__dirname, '..')];

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// If you enable this flag, `*.clip.*` files will be prioritized. You can use this to optimize your JS bundle.
const USE_CLIP_FILE_EXT = false;
if (USE_CLIP_FILE_EXT && process.env.BUILDING_FOR_APP_CLIP) {
    console.info("Building for App Clip");
    config.resolver = {
        ...config.resolver,
        sourceExts: [].concat(
            config.resolver.sourceExts.map(e => `clip.${e}`),
            config.resolver.sourceExts,
        ),
    }
}

module.exports = config;
