"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withConfig_1 = require("./withConfig");
const withEntitlements_1 = require("./withEntitlements");
const withPlist_1 = require("./withPlist");
const withPodfile_1 = require("./withPodfile");
const withXcode_1 = require("./withXcode");
const DeviceFamily_1 = require("@expo/config-plugins/build/ios/DeviceFamily");
const withAppClip = (config, { name, enabled, bundleIdSuffix, targetSuffix, groupIdentifier, deploymentTarget, requestEphemeralUserNotification, requestLocationConfirmation, appleSignin, applePayMerchantIds, excludedPackages, pushNotifications, enableCompression, } = {}) => {
    name ??= "Clip";
    bundleIdSuffix ??= "Clip";
    targetSuffix ??= "Clip";
    deploymentTarget ??= "15.1";
    requestEphemeralUserNotification ??= false;
    requestLocationConfirmation ??= false;
    appleSignin ??= false;
    enabled ??= true;
    pushNotifications ??= false;
    if (!enabled) {
        return config;
    }
    if (!config.ios?.bundleIdentifier) {
        throw new Error("No bundle identifier specified in app config");
    }
    const bundleIdentifier = `${config.ios.bundleIdentifier}.${bundleIdSuffix}`;
    const targetName = `${config_plugins_1.IOSConfig.XcodeUtils.sanitizedName(config.name)}${targetSuffix}`;
    const modifiedConfig = (0, config_plugins_1.withPlugins)(config, [
        DeviceFamily_1.withDeviceFamily,
        [
            withConfig_1.withConfig,
            { targetName, bundleIdentifier, appleSignin, applePayMerchantIds, pushNotifications },
        ],
        [
            withEntitlements_1.withEntitlements,
            { targetName, groupIdentifier, appleSignin, applePayMerchantIds, pushNotifications },
        ],
        [withPodfile_1.withPodfile, { targetName, excludedPackages }],
        [
            withPlist_1.withPlist,
            {
                targetName,
                deploymentTarget,
                requestEphemeralUserNotification,
                requestLocationConfirmation,
            },
        ],
        [
            withXcode_1.withXcode,
            {
                name,
                targetName,
                bundleIdentifier,
                deploymentTarget,
                enableCompression,
            },
        ],
    ]);
    return modifiedConfig;
};
exports.default = withAppClip;
