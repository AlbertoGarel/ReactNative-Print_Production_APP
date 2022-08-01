const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
    resolver: {
        assetExts: [...defaultConfig.resolver.assetExts, 'db'],
    },
};

defaultConfig.transformer.minifierConfig.compress.drop_console = true;

module.exports = defaultConfig;