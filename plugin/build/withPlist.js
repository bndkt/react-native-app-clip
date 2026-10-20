"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPlist = void 0;
const plist_1 = __importDefault(require("@expo/plist"));
const config_plugins_1 = require("expo/config-plugins");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const getAppClipIcon_1 = require("./lib/getAppClipIcon");
/**
 * List of keys that are not allowed in the Info.plist due to not being supported in App Clip. Add to this array as new build issues arise.
 */
const DisallowedPlistKeys = [
    "UIBackgroundModes",
];
const withPlist = (config, { targetName, deploymentTarget, requestEphemeralUserNotification, requestLocationConfirmation, }) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const targetPath = node_path_1.default.join(config.modRequest.platformProjectRoot, targetName);
        // Info.plist
        const filePath = node_path_1.default.join(targetPath, "Info.plist");
        const infoPlist = {
            NSAppClip: {
                NSAppClipRequestEphemeralUserNotification: requestEphemeralUserNotification,
                NSAppClipRequestLocationConfirmation: requestLocationConfirmation,
            },
            NSAppTransportSecurity: {
                NSAllowsArbitraryLoads: config.developmentClient,
                NSExceptionDomains: {
                    localhost: {
                        NSExceptionAllowsInsecureHTTPLoads: config.developmentClient,
                    },
                },
                NSAllowsLocalNetworking: config.developmentClient,
            },
            CFBundleName: "$(PRODUCT_MODULE_NAME)",
            CFBundleDisplayName: "$(PRODUCT_NAME)",
            CFBundleIdentifier: "$(PRODUCT_BUNDLE_IDENTIFIER)",
            CFBundleVersion: "$(CURRENT_PROJECT_VERSION)",
            CFBundleExecutable: "$(EXECUTABLE_NAME)",
            CFBundlePackageType: "$(PRODUCT_BUNDLE_PACKAGE_TYPE)",
            CFBundleShortVersionString: config.version,
            UIViewControllerBasedStatusBarAppearance: "NO",
            UILaunchStoryboardName: "SplashScreen",
            UIRequiresFullScreen: true,
            MinimumOSVersion: deploymentTarget,
        };
        if (config.ios?.infoPlist) {
            for (const key of Object.keys(config.ios?.infoPlist)) {
                if (config.ios?.infoPlist && !DisallowedPlistKeys.some((disallowedKey) => disallowedKey === key)) {
                    infoPlist[key] = config.ios.infoPlist[key];
                }
            }
        }
        infoPlist.CFBundleName = "$(PRODUCT_MODULE_NAME)";
        const appClipIcon = (0, getAppClipIcon_1.getAppClipIcon)(config);
        if (appClipIcon) {
            infoPlist.CFBundleIconName = appClipIcon.name;
        }
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), {
            recursive: true,
        });
        node_fs_1.default.writeFileSync(filePath, plist_1.default.build(infoPlist));
        // Expo.plist
        const expoPlistFilePath = node_path_1.default.join(targetPath, "Supporting/Expo.plist");
        const expoPlist = {
            EXUpdatesRuntimeVersion: "exposdk:51.0.0", // TODO
            // EXUpdatesURL: "", // TODO
            EXUpdatesEnabled: false,
        };
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(expoPlistFilePath), {
            recursive: true,
        });
        node_fs_1.default.writeFileSync(expoPlistFilePath, plist_1.default.build(expoPlist));
        return config;
    });
};
exports.withPlist = withPlist;
