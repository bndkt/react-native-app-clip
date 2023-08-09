import { ConfigPlugin } from "@expo/config-plugins";

import {
  addApplicationGroupsEntitlement,
  getAppClipEntitlements,
} from "./lib/getAppClipEntitlements";

export const withConfig: ConfigPlugin<{
  bundleIdentifier: string;
  targetName: string;
  groupIdentifier?: string;
  appleSignin: boolean;
}> = (
  config,
  { bundleIdentifier, targetName, groupIdentifier, appleSignin }
) => {
  let configIndex: null | number = null;
  config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach(
    (ext: any, index: number) => {
      if (ext.targetName === targetName) {
        configIndex = index;
      }
    }
  );

  if (!configIndex) {
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
                  targetName,
                  bundleIdentifier,
                },
              ],
            },
          },
        },
      },
    };
    configIndex = 0;
  }

  if (configIndex != null && config.extra) {
    const appClipConfig =
      config.extra.eas.build.experimental.ios.appExtensions[configIndex];

    appClipConfig.entitlements = {
      ...appClipConfig.entitlements,
      ...getAppClipEntitlements(config.ios, {
        appleSignin,
        // groupIdentifier, // Throws an error in EAS
      }),
    };
  }

  // Entitlements
  config.ios = {
    ...config.ios,
    entitlements: {
      ...addApplicationGroupsEntitlement(
        config.ios?.entitlements ?? {},
        groupIdentifier
      ),
      "com.apple.developer.associated-appclip-app-identifiers": [
        `$(AppIdentifierPrefix)${bundleIdentifier}`,
      ],
    },
  };

  return config;
};
