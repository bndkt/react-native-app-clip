"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withConfig_1 = require("./withConfig");
const withAppClipEntitlements_1 = require("./withAppClipEntitlements");
const withPodfile_1 = require("./withPodfile");
const withAppClipPlist_1 = require("./withAppClipPlist");
const withXcode_1 = require("./withXcode");
const withAppClip = (config, { name = "Clip", groupIdentifier, deploymentTarget = "14.0", requestEphemeralUserNotification, requestLocationConfirmation, appleSignin = true, excludedPackages, }) => {
    const bundleIdentifier = `${config.ios?.bundleIdentifier}.Clip`;
    const targetName = `${config_plugins_1.IOSConfig.XcodeUtils.sanitizedName(config.name)}Clip`;
    config = (0, config_plugins_1.withPlugins)(config, [
        [
            withConfig_1.withConfig,
            {
                bundleIdentifier,
                targetName,
                groupIdentifier,
                appleSignin,
            },
        ],
        [withAppClipEntitlements_1.withAppClipEntitlements, { targetName, groupIdentifier, appleSignin }],
        [withPodfile_1.withPodfile, { targetName, excludedPackages }],
        [
            withAppClipPlist_1.withAppClipPlist,
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
            },
        ],
    ]);
    return config;
};
exports.default = withAppClip;
