import { ConfigPlugin } from "@expo/config-plugins";

import { getAppClipBundleIdentifier, getAppClipFolder } from "./withIosAppClip";

export const withAppClipAppConfig: ConfigPlugin = (config) => {
  const appBundleIdentifier = config.ios!.bundleIdentifier!;
  const appClipName = getAppClipFolder(config.name);
  const appClipBundleIdentifier = getAppClipBundleIdentifier(
    config.ios!.bundleIdentifier!
  );

  let appClipConfigExists = false;
  config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach(
    (ext: any) => {
      ext.targetName === appClipName && (appClipConfigExists = true);
    }
  );

  !appClipConfigExists &&
    (config.extra = {
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
                  bundleIdentifier: `$(AppIdentifierPrefix)${appClipBundleIdentifier}`,
                  entitlements: {
                    "com.apple.developer.parent-application-identifiers": [
                      `$(AppIdentifierPrefix)${appBundleIdentifier}`,
                    ],
                    "com.apple.developer.on-demand-install-capable": true,
                  },
                },
              ],
            },
          },
        },
      },
    });

  return config;
};
