"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withConfig = void 0;
const getAppClipEntitlements_1 = require("./lib/getAppClipEntitlements");
const withConfig = (config, { bundleIdentifier, targetName, groupIdentifier, appleSignin }) => {
    let configIndex = null;
    config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach((ext, index) => {
        if (ext.targetName === targetName) {
            configIndex = index;
        }
    });
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
        const appClipConfig = config.extra.eas.build.experimental.ios.appExtensions[configIndex];
        appClipConfig.entitlements = {
            ...appClipConfig.entitlements,
            ...(0, getAppClipEntitlements_1.getAppClipEntitlements)(config.ios, {
                appleSignin,
                // groupIdentifier, // Throws an error in EAS
            }),
        };
    }
    // Entitlements
    config.ios = {
        ...config.ios,
        entitlements: {
            ...(0, getAppClipEntitlements_1.addApplicationGroupsEntitlement)(config.ios?.entitlements ?? {}, groupIdentifier),
            "com.apple.developer.associated-appclip-app-identifiers": [
                `$(AppIdentifierPrefix)${bundleIdentifier}`,
            ],
        },
    };
    return config;
};
exports.withConfig = withConfig;
