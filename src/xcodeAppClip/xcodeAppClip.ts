import { XcodeProject } from "@expo/config-plugins";

import { quoted } from "./util";
import addXCConfigurationList from "./addXCConfigurationList";
import addProductFile from "./addProductFile";
import addToPbxNativeTargetSection from "./addToPbxNativeTargetSection";
import addTargetDependency from "./addTargetDependency";
import addToPbxProjectSection from "./addToPbxProjectSection";

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

  const xCConfigurationList = addXCConfigurationList(
    proj,
    appClipName,
    appClipBundleIdentifier
  );
  const productFile = addProductFile(proj, appClipName, targetUuid, groupName);
  const target = addToPbxNativeTargetSection(proj, {
    appClipName,
    targetUuid,
    productFile,
    xCConfigurationList,
  });
  addToPbxProjectSection(proj, target);
  addTargetDependency(proj, target);

  return true;
}
