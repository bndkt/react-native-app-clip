import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";

import { addXCConfigurationList } from "./xcode/addXCConfigurationList";
import { addProductFile } from "./xcode/addProductFile";
import { addToPbxNativeTargetSection } from "./xcode/addToPbxNativeTargetSection";
import { addToPbxProjectSection } from "./xcode/addToPbxProjectSection";
import { addTargetDependency } from "./xcode/addTargetDependency";
import { addPbxGroup } from "./xcode/addPbxGroup";
import { addBuildPhases } from "./xcode/addBuildPhases";

export const withXcode: ConfigPlugin<{
  name: string;
  targetName: string;
  bundleIdentifier: string;
  deploymentTarget: string;
}> = (config, { name, targetName, bundleIdentifier, deploymentTarget }) => {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;

    const targetUuid = xcodeProject.generateUuid();
    const groupName = "Embed App Clips";
    const { projectName, platformProjectRoot } = config.modRequest;

    const xCConfigurationList = addXCConfigurationList(xcodeProject, {
      name,
      targetName,
      currentProjectVersion: config.ios!.buildNumber || "1",
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

    addBuildPhases(xcodeProject, {
      targetName,
      targetUuid,
      groupName,
      productFile,
    });

    return config;
  });
};
