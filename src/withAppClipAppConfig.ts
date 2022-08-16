import { ConfigPlugin, InfoPlist } from "@expo/config-plugins";

import { getAppClipBundleIdentifier, getAppClipFolder } from "./withIosAppClip";

export const withAppClipAppConfig: ConfigPlugin = (config) => {
  const appBundleIdentifier = config.ios!.bundleIdentifier!;
  const appClipName = getAppClipFolder(config.name);
  const appClipBundleIdentifier = getAppClipBundleIdentifier(
    config.ios!.bundleIdentifier!
  );

  let appClipConfigIndex = null;
  config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach(
    (ext: any, index: number) => {
      ext.targetName === appClipName && (appClipConfigIndex = index);
    }
  );

  const newEntitlements: InfoPlist = {
    "com.apple.developer.parent-application-identifiers": [
      `${appBundleIdentifier}`,
    ],
    "com.apple.developer.on-demand-install-capable": true,
  };

  config.ios!.usesAppleSignIn &&
    (newEntitlements["com.apple.developer.applesignin"] = ["Default"]);

  config.ios!.associatedDomains &&
    (newEntitlements["com.apple.developer.associated-domains"] =
      config.ios!.associatedDomains);

  if (!appClipConfigIndex) {
    config.extra = {
      ...config.extra,
      eas: {
        ...config.extra?.eas,
        build: {
          ...config.extra?.eas?.build,
          experimental: {
            ...config.extra?.eas?.build?.experimental,
            ios: {
              ...config.extra?.eas?.build?.experimental?.ios,
              appExtensions: [
                ...(config.extra?.eas?.build?.experimental?.ios
                  ?.appExtensions ?? []),
                {
                  targetName: appClipName,
                  bundleIdentifier: `${appClipBundleIdentifier}`,
                },
              ],
            },
          },
        },
      },
    };
    appClipConfigIndex = 0;
  }

  if (appClipConfigIndex != null && config.extra) {
    const appClipConfig =
      config.extra.eas.build.experimental.ios.appExtensions[appClipConfigIndex];

    appClipConfig.entitlements = {
      ...appClipConfig.entitlements,
      ...newEntitlements,
    };
  }

  return config;
};
