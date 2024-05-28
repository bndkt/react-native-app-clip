"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPbxGroup = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function addPbxGroup(xcodeProject, { projectName, targetName, platformProjectRoot, }) {
    const targetPath = path_1.default.join(platformProjectRoot, targetName);
    if (!fs_1.default.existsSync(targetPath)) {
        fs_1.default.mkdirSync(targetPath, { recursive: true });
    }
    const filesToCopy = [
        "SplashScreen.storyboard",
        "AppDelegate.h",
        "AppDelegate.mm",
        "main.m",
    ];
    filesToCopy.forEach((file) => {
        const source = path_1.default.join(platformProjectRoot, projectName, file);
        copyFileSync(source, targetPath);
    });
    // Copy Images.xcassets
    const imagesXcassetsSource = path_1.default.join(platformProjectRoot, projectName, "Images.xcassets");
    copyFolderRecursiveSync(imagesXcassetsSource, targetPath);
    // Add PBX group
    const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup([
        `AppDelegate.h`,
        `AppDelegate.mm`,
        `main.m`,
        `${targetName}/Info.plist`,
        `Images.xcassets`,
        `SplashScreen.storyboard`,
        `${targetName}/${targetName}.entitlements`,
        `Supporting/Expo.plist`,
        /* "main.jsbundle", */
    ], targetName, targetName);
    // Add PBXGroup to top level group
    const groups = xcodeProject.hash.project.objects["PBXGroup"];
    if (pbxGroupUuid) {
        Object.keys(groups).forEach(function (key) {
            if (groups[key].name === undefined && groups[key].path === undefined) {
                xcodeProject.addToPbxGroup(pbxGroupUuid, key);
            }
        });
    }
}
exports.addPbxGroup = addPbxGroup;
function copyFileSync(source, target) {
    let targetFile = target;
    if (fs_1.default.existsSync(target) && fs_1.default.lstatSync(target).isDirectory()) {
        targetFile = path_1.default.join(target, path_1.default.basename(source));
    }
    fs_1.default.writeFileSync(targetFile, fs_1.default.readFileSync(source));
}
function copyFolderRecursiveSync(source, target) {
    const targetPath = path_1.default.join(target, path_1.default.basename(source));
    if (!fs_1.default.existsSync(targetPath)) {
        fs_1.default.mkdirSync(targetPath, { recursive: true });
    }
    if (fs_1.default.lstatSync(source).isDirectory()) {
        const files = fs_1.default.readdirSync(source);
        files.forEach((file) => {
            const currentPath = path_1.default.join(source, file);
            if (fs_1.default.lstatSync(currentPath).isDirectory()) {
                copyFolderRecursiveSync(currentPath, targetPath);
            }
            else {
                copyFileSync(currentPath, targetPath);
            }
        });
    }
}
