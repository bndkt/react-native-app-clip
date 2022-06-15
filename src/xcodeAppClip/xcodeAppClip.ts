import { XcodeProject } from "@expo/config-plugins";

import { quoted } from "./util";
import addXCConfigurationList from "./addXCConfigurationList";
import addProductFile from "./addProductFile";
import addToPbxNativeTargetSection from "./addToPbxNativeTargetSection";
import addTargetDependency from "./addTargetDependency";
import addToPbxProjectSection from "./addToPbxProjectSection";
import addBuildPhases from "./addBuildPhases";

export async function addAppClipXcodeTarget(
  proj: XcodeProject,
  {
    appClipName,
    appClipBundleIdentifier,
    appClipRootPath,
  }: {
    appClipName: string;
    appClipBundleIdentifier: string;
    appClipRootPath: string;
  }
) {
  const targetUuid = proj.generateUuid();
  const groupName = "Embed App Clips";
  const buildPath = quoted("$(CONTENTS_FOLDER_PATH)/AppClips");

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
  addBuildPhases(proj, { groupName, productFile });

  return true;
}
