import { ConfigPlugin, withEntitlementsPlist } from "@expo/config-plugins";

import { getAppClipBundleIdentifier } from ".";

export const withAppEntitlements: ConfigPlugin = (config) => {
  return withEntitlementsPlist(config, (config) => {
    const bundleIdentifier = getAppClipBundleIdentifier(
      config.ios!.bundleIdentifier!
    );

    config.modResults[
      "com.apple.developer.associated-appclip-app-identifiers"
    ] = [`$(AppIdentifierPrefix)${bundleIdentifier}`];
    return config;
  });
};
