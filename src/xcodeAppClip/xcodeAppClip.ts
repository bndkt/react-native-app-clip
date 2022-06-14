import * as path from "path";
import * as fs from "fs";
import { XcodeProject } from "@expo/config-plugins";

import { quoted } from "./util";
import addXCConfigurationList from "./addXCConfigurationList";
import addProductFile from "./addProductFile";

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
  const productType =
    "com.apple.product-type.application.on-demand-install-capable";
  const buildPath = quoted("$(CONTENTS_FOLDER_PATH)/AppClips");

  addXCConfigurationList(proj, appClipName, appClipBundleIdentifier);
  addProductFile(proj, appClipName, targetUuid, groupName);

  return true;
}
