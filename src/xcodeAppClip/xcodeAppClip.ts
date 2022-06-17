import { XcodeProject } from "@expo/config-plugins";

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
    appClipBundleIdentifier,
    appClipRootPath,
    platformProjectRoot,
  }: {
    appName: string;
    appClipName: string;
    appClipBundleIdentifier: string;
    appClipRootPath: string;
    platformProjectRoot: string;
  }
) {
  const targetUuid = proj.generateUuid();
  const groupName = "Embed App Clips";

  // Add XCConfigurationList
  const xCConfigurationList = addXCConfigurationList(
    proj,
    appClipName,
    appClipBundleIdentifier
  );

  // Add product file
  const productFile = addProductFile(proj, appClipName, targetUuid, groupName);

  // Add target
  const target = addToPbxNativeTargetSection(proj, {
    appClipName,
    targetUuid,
    productFile,
    xCConfigurationList,
  });

  // Add target to PBX project section
  addToPbxProjectSection(proj, target);

  // Add target dependency
  addTargetDependency(proj, target);

  // Add build phases
  addBuildPhases(proj, { groupName, productFile, targetUuid });

  // Add PBXGroup
  addPbxGroup(proj, { appName, appClipName, platformProjectRoot });

  return true;
}
