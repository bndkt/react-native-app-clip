"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withEntitlements = void 0;
const plist_1 = __importDefault(require("@expo/plist"));
const config_plugins_1 = require("expo/config-plugins");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const getAppClipEntitlements_1 = require("./lib/getAppClipEntitlements");
const withEntitlements = (config, { targetName, groupIdentifier, appleSignin, applePayMerchantIds, pushNotifications }) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const targetPath = node_path_1.default.join(config.modRequest.platformProjectRoot, targetName);
        const filePath = node_path_1.default.join(targetPath, `${targetName}.entitlements`);
        if (config.ios === undefined) {
            throw new Error("Missing iOS config");
        }
        const appClipEntitlements = (0, getAppClipEntitlements_1.getAppClipEntitlements)(config.ios, {
            groupIdentifier,
            appleSignin,
            applePayMerchantIds,
            pushNotifications,
        });
        node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
        node_fs_1.default.writeFileSync(filePath, plist_1.default.build(appClipEntitlements));
        return config;
    });
};
exports.withEntitlements = withEntitlements;
