import { type ConfigPlugin, withXcodeProject } from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

import { addBuildPhases } from "./xcode/addBuildPhases";
import { addPbxGroup } from "./xcode/addPbxGroup";
import { modifyAppDelegate } from "./xcode/modifyAppDelegate";
import { addProductFile } from "./xcode/addProductFile";
import { addTargetDependency } from "./xcode/addTargetDependency";
import { addToPbxNativeTargetSection } from "./xcode/addToPbxNativeTargetSection";
import { addToPbxProjectSection } from "./xcode/addToPbxProjectSection";
import { addXCConfigurationList } from "./xcode/addXCConfigurationList";

export const withXcode: ConfigPlugin<{
  name: string;
  targetName: string;
  bundleIdentifier: string;
  deploymentTarget: string;
  enableCompression?: boolean;
}> = (config, { name, targetName, bundleIdentifier, deploymentTarget, enableCompression }) => {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;

    const targetUuid = xcodeProject.generateUuid();
    const groupName = "Embed App Clips";
    const { projectName, platformProjectRoot } = config.modRequest;

    const xCConfigurationList = addXCConfigurationList(xcodeProject, {
      name,
      targetName,
      currentProjectVersion: config.ios?.buildNumber || "1",
      bundleIdentifier,
      deploymentTarget,
    });

    const productFile = addProductFile(xcodeProject, {
      targetName,
      groupName,
    });

    const target = addToPbxNativeTargetSection(xcodeProject, {
      targetName,
      targetUuid,
      productFile,
      xCConfigurationList,
    });

    addToPbxProjectSection(xcodeProject, target);

    addTargetDependency(xcodeProject, target);

    addPbxGroup(xcodeProject, {
      projectName: projectName as string,
      targetName,
      platformProjectRoot,
    });

    if (enableCompression) {
      const appDelegatePath = path.join(
        platformProjectRoot,
        targetName,
        "AppDelegate.swift",
      );
      if (fs.existsSync(appDelegatePath)) {
        modifyAppDelegate(appDelegatePath);
      } else {
        console.warn(`⚠️ AppDelegate not found at ${appDelegatePath}`);
      }
    }

    addBuildPhases(xcodeProject, {
      targetUuid,
      groupName,
      productFile,
      enableCompression,
    });

    return config;
  });
};
