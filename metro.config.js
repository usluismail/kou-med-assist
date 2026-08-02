const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Expo SDK 57 Expo Go: worklets/reanimated eager init SIGSEGV.
// 1) inlineRequires delays init
// 2) stub worklets in Expo Go so the host app doesn't crash on load
config.transformer.getTransformOptions = async () => ({
  transform: {
    inlineRequires: true,
  },
});

const baseResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-worklets") {
    return { type: "empty" };
  }
  return baseResolveRequest
    ? baseResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
