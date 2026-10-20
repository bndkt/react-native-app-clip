"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppClipIcon = getAppClipIcon;
const node_path_1 = __importDefault(require("node:path"));
function getAppClipIcon(config) {
    let icon = config.ios?.icon || config.icon;
    if (icon && typeof icon === "object" && !icon.light && !icon.dark && !icon.tinted) {
        icon = config.icon;
    }
    if (typeof icon !== "string" || node_path_1.default.extname(icon) !== ".icon") {
        return undefined;
    }
    return {
        name: node_path_1.default.basename(icon, ".icon"),
        fileName: node_path_1.default.basename(icon),
    };
}
