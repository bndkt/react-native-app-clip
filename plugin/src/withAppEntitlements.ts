import { ConfigPlugin, withEntitlementsPlist } from "@expo/config-plugins";

export const withAppEntitlements: ConfigPlugin<{
  appClipBundleIdentifier: string;
}> = (config, { appClipBundleIdentifier }) => {
  return withEntitlementsPlist(config, (config) => {
    config.modResults[
      "com.apple.developer.associated-appclip-app-identifiers"
    ] = [`$(AppIdentifierPrefix)${appClipBundleIdentifier}`];
    return config;
  });
};
