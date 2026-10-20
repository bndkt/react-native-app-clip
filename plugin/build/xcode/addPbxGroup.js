"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPbxGroup = addPbxGroup;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function addPbxGroup(xcodeProject, { projectName, targetName, platformProjectRoot, appIconFileName, }) {
    const targetPath = node_path_1.default.join(platformProjectRoot, targetName);
    if (!node_fs_1.default.existsSync(targetPath)) {
        node_fs_1.default.mkdirSync(targetPath, { recursive: true });
    }
    const filesToCopy = [
        "SplashScreen.storyboard",
        "AppDelegate.swift",
    ];
    for (const file of filesToCopy) {
        const source = node_path_1.default.join(platformProjectRoot, projectName, file);
        copyFileSync(source, targetPath);
    }
    // Copy Images.xcassets
    const imagesXcassetsSource = node_path_1.default.join(platformProjectRoot, projectName, "Images.xcassets");
    copyFolderRecursiveSync(imagesXcassetsSource, targetPath);
    if (appIconFileName) {
        node_fs_1.default.cpSync(node_path_1.default.join(platformProjectRoot, projectName, appIconFileName), node_path_1.default.join(targetPath, appIconFileName), { recursive: true });
    }
    // Add PBX group
    const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup([
        "AppDelegate.swift",
        "Info.plist",
        "Images.xcassets",
        "SplashScreen.storyboard",
        `${targetName}.entitlements`,
        "Supporting/Expo.plist",
        /* "main.jsbundle", */
    ], targetName, targetName);
    // Add PBXGroup to top level group
    const groups = xcodeProject.hash.project.objects.PBXGroup;
    if (pbxGroupUuid) {
        for (const key of Object.keys(groups)) {
            if (groups[key].name === undefined && groups[key].path === undefined) {
                xcodeProject.addToPbxGroup(pbxGroupUuid, key);
            }
        }
    }
}
function copyFileSync(source, target) {
    let targetFile = target;
    if (node_fs_1.default.existsSync(target) && node_fs_1.default.lstatSync(target).isDirectory()) {
        targetFile = node_path_1.default.join(target, node_path_1.default.basename(source));
    }
    node_fs_1.default.writeFileSync(targetFile, node_fs_1.default.readFileSync(source));
}
function copyFolderRecursiveSync(source, target) {
    const targetPath = node_path_1.default.join(target, node_path_1.default.basename(source));
    if (!node_fs_1.default.existsSync(targetPath)) {
        node_fs_1.default.mkdirSync(targetPath, { recursive: true });
    }
    if (node_fs_1.default.lstatSync(source).isDirectory()) {
        const files = node_fs_1.default.readdirSync(source);
        for (const file of files) {
            const currentPath = node_path_1.default.join(source, file);
            if (node_fs_1.default.lstatSync(currentPath).isDirectory()) {
                copyFolderRecursiveSync(currentPath, targetPath);
            }
            else {
                copyFileSync(currentPath, targetPath);
            }
        }
    }
}
