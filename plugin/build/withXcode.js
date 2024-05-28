"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withXcode = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const addXCConfigurationList_1 = require("./xcode/addXCConfigurationList");
const addProductFile_1 = require("./xcode/addProductFile");
const addToPbxNativeTargetSection_1 = require("./xcode/addToPbxNativeTargetSection");
const addToPbxProjectSection_1 = require("./xcode/addToPbxProjectSection");
const addTargetDependency_1 = require("./xcode/addTargetDependency");
const addPbxGroup_1 = require("./xcode/addPbxGroup");
const addBuildPhases_1 = require("./xcode/addBuildPhases");
const withXcode = (config, { name, targetName, bundleIdentifier, deploymentTarget }) => {
    return (0, config_plugins_1.withXcodeProject)(config, (config) => {
        const xcodeProject = config.modResults;
        const targetUuid = xcodeProject.generateUuid();
        const groupName = "Embed App Clips";
        const { projectName, platformProjectRoot } = config.modRequest;
        const xCConfigurationList = (0, addXCConfigurationList_1.addXCConfigurationList)(xcodeProject, {
            name,
            targetName,
            currentProjectVersion: config.ios.buildNumber || "1",
            bundleIdentifier,
            deploymentTarget,
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
        });
        (0, addBuildPhases_1.addBuildPhases)(xcodeProject, {
            targetName,
            targetUuid,
            groupName,
            productFile,
        });
        return config;
    });
};
exports.withXcode = withXcode;
