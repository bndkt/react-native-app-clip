"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withXcode = void 0;
const config_plugins_1 = require("expo/config-plugins");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const getAppClipIcon_1 = require("./lib/getAppClipIcon");
const addBuildPhases_1 = require("./xcode/addBuildPhases");
const addPbxGroup_1 = require("./xcode/addPbxGroup");
const modifyAppDelegate_1 = require("./xcode/modifyAppDelegate");
const addProductFile_1 = require("./xcode/addProductFile");
const addTargetDependency_1 = require("./xcode/addTargetDependency");
const addToPbxNativeTargetSection_1 = require("./xcode/addToPbxNativeTargetSection");
const addToPbxProjectSection_1 = require("./xcode/addToPbxProjectSection");
const addXCConfigurationList_1 = require("./xcode/addXCConfigurationList");
const withXcode = (config, { name, targetName, bundleIdentifier, deploymentTarget, enableCompression }) => {
    return (0, config_plugins_1.withXcodeProject)(config, (config) => {
        const xcodeProject = config.modResults;
        const appClipIcon = (0, getAppClipIcon_1.getAppClipIcon)(config);
        const targetUuid = xcodeProject.generateUuid();
        const groupName = "Embed App Clips";
        const { projectName, platformProjectRoot } = config.modRequest;
        const xCConfigurationList = (0, addXCConfigurationList_1.addXCConfigurationList)(xcodeProject, {
            name,
            targetName,
            currentProjectVersion: config.ios?.buildNumber || "1",
            bundleIdentifier,
            deploymentTarget,
            appleTeamId: config.ios?.appleTeamId,
            appIconName: appClipIcon?.name,
        });
        const productFile = (0, addProductFile_1.addProductFile)(xcodeProject, {
            targetName,
            groupName,
        });
        const target = (0, addToPbxNativeTargetSection_1.addToPbxNativeTargetSection)(xcodeProject, {
            targetName,
            targetUuid,
            productFile,
            xCConfigurationList,
        });
        (0, addToPbxProjectSection_1.addToPbxProjectSection)(xcodeProject, target);
        (0, addTargetDependency_1.addTargetDependency)(xcodeProject, target);
        (0, addPbxGroup_1.addPbxGroup)(xcodeProject, {
            projectName: projectName,
            targetName,
            platformProjectRoot,
            appIconFileName: appClipIcon?.fileName,
        });
        if (enableCompression) {
            const appDelegatePath = node_path_1.default.join(platformProjectRoot, targetName, "AppDelegate.swift");
            if (node_fs_1.default.existsSync(appDelegatePath)) {
                (0, modifyAppDelegate_1.modifyAppDelegate)(appDelegatePath);
            }
            else {
                console.warn(`⚠️ AppDelegate not found at ${appDelegatePath}`);
            }
        }
        (0, addBuildPhases_1.addBuildPhases)(xcodeProject, {
            targetUuid,
            groupName,
            productFile,
            enableCompression,
            resourcesPhaseName: appClipIcon ? "Resources" : undefined,
        });
        if (appClipIcon) {
            config_plugins_1.IOSConfig.XcodeUtils.addResourceFileToGroup({
                filepath: appClipIcon.fileName,
                groupName: targetName,
                project: xcodeProject,
                isBuildFile: true,
                targetUuid,
            });
        }
        return config;
    });
};
exports.withXcode = withXcode;
