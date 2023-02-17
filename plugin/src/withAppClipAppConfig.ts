import { ConfigPlugin, InfoPlist, ExportedConfig } from "@expo/config-plugins";

export const getAppClipEntitlements = (iosConfig: ExportedConfig["ios"]) => {
  const appBundleIdentifier = iosConfig!.bundleIdentifier!;
  const entitlements: InfoPlist = {
    "com.apple.developer.parent-application-identifiers": [
      `$(AppIdentifierPrefix)${appBundleIdentifier}`,
    ],
    "com.apple.developer.on-demand-install-capable": true,
  };

  iosConfig?.usesAppleSignIn &&
    (entitlements["com.apple.developer.applesignin"] = ["Default"]);

  iosConfig?.associatedDomains &&
    (entitlements["com.apple.developer.associated-domains"] =
      iosConfig.associatedDomains);

  return entitlements;
};

export const withAppClipAppConfig: ConfigPlugin<{
  appClipFolder: string;
  appClipBundleIdentifier: string;
}> = (config, { appClipFolder, appClipBundleIdentifier }) => {
  let appClipConfigIndex: null | number = null;
  config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach(
    (ext: any, index: number) => {
      ext.targetName === appClipFolder && (appClipConfigIndex = index);
    }
  );

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
                  targetName: appClipFolder,
                  bundleIdentifier: appClipBundleIdentifier,
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
      ...getAppClipEntitlements(config.ios),
    };
  }

  return config;
};
