"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAppClipPlist = void 0;
const plist_1 = __importDefault(require("@expo/plist"));
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const withAppClipPlist = (config, { targetName, deploymentTarget, requestEphemeralUserNotification = false, requestLocationConfirmation = false, }) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const targetPath = path_1.default.join(config.modRequest.platformProjectRoot, targetName);
        // Info.plist
        const filePath = path_1.default.join(targetPath, "Info.plist");
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
            CFBundleName: "$(PRODUCT_NAME)",
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
        config.ios?.infoPlist &&
            Object.keys(config.ios?.infoPlist).forEach((key) => {
                config.ios?.infoPlist && (infoPlist[key] = config.ios.infoPlist[key]);
            });
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), {
            recursive: true,
        });
        fs_1.default.writeFileSync(filePath, plist_1.default.build(infoPlist));
        // Expo.plist
        const expoPlistFilePath = path_1.default.join(targetPath, "Supporting/Expo.plist");
        const expoPlist = {
            EXUpdatesRuntimeVersion: "50.0.0", // TODO
            // EXUpdatesURL: "", // TODO
            EXUpdatesEnabled: false,
        };
        fs_1.default.mkdirSync(path_1.default.dirname(expoPlistFilePath), {
            recursive: true,
        });
        fs_1.default.writeFileSync(expoPlistFilePath, plist_1.default.build(expoPlist));
        return config;
    });
};
exports.withAppClipPlist = withAppClipPlist;
