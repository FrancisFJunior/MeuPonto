const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuração para web
config.resolver.assetExts.push('db', 'sqlite', 'ttf', 'otf', 'woff', 'woff2');

module.exports = config;