"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAppClipEntitlements = void 0;
const plist_1 = __importDefault(require("@expo/plist"));
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAppClipEntitlements_1 = require("./lib/getAppClipEntitlements");
const withAppClipEntitlements = (config, { targetName, groupIdentifier, appleSignin }) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const targetPath = path_1.default.join(config.modRequest.platformProjectRoot, targetName);
        const filePath = path_1.default.join(targetPath, `${targetName}.entitlements`);
        const appClipEntitlements = (0, getAppClipEntitlements_1.getAppClipEntitlements)(config.ios, {
            groupIdentifier,
            appleSignin,
        });
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
        fs_1.default.writeFileSync(filePath, plist_1.default.build(appClipEntitlements));
        return config;
    });
};
exports.withAppClipEntitlements = withAppClipEntitlements;
