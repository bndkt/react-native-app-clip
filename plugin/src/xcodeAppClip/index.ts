import { XcodeProject } from "expo/config-plugins";

import addBuildPhases from "./addBuildPhases";
import addPbxGroup from "./addPbxGroup";
import addProductFile from "./addProductFile";
import addTargetDependency from "./addTargetDependency";
import addToPbxNativeTargetSection from "./addToPbxNativeTargetSection";
import addToPbxProjectSection from "./addToPbxProjectSection";
import addXCConfigurationList from "./addXCConfigurationList";

export async function addAppClipXcodeTarget(
  proj: XcodeProject,
  {
    appName,
    appClipName,
    appClipFolder,
    appClipBundleIdentifier,
    platformProjectRoot,
    currentProjectVersion,
    marketingVersion,
    clipRootFolder,
  }: {
    appName: string;
    appClipName: string;
    appClipFolder: string;
    appClipBundleIdentifier: string;
    platformProjectRoot: string;
    currentProjectVersion: string;
    marketingVersion: string;
    clipRootFolder?: string;
  }
) {
  const targetUuid = proj.generateUuid();
  const groupName = "Embed App Clips";

  // Add XCConfigurationList
  const xCConfigurationList = addXCConfigurationList(proj, {
    appClipFolder,
    appClipBundleIdentifier,
    currentProjectVersion,
    marketingVersion,
    appClipName,
  });

  // Add product file
  const productFile = addProductFile(
    proj,
    appClipFolder,
    targetUuid,
    groupName
  );

  // Add target
  const target = addToPbxNativeTargetSection(proj, {
    appClipFolder,
    targetUuid,
    productFile,
    xCConfigurationList,
  });

  // Add target to PBX project section
  addToPbxProjectSection(proj, target);

  // Add target dependency
  addTargetDependency(proj, target);

  // Add build phases
  addBuildPhases(proj, { groupName, productFile, targetUuid, clipRootFolder });

  // Add PBXGroup
  addPbxGroup(proj, { appName, appClipFolder, platformProjectRoot });

  return true;
}
