import * as path from "path";
import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";

import { addAppClipXcodeTarget } from "./xcodeAppClip/xcodeAppClip";
import { getAppClipBundleIdentifier, getAppClipName } from "./withIosAppClip";

export const withAppClipXcodeTarget: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const appClipName = getAppClipName(config.modRequest.projectName!);
    const appClipBundleIdentifier = getAppClipBundleIdentifier(
      config.ios!.bundleIdentifier!
    );
    const appClipRootPath = path.join(
      config.modRequest.platformProjectRoot,
      appClipName
    );

    addAppClipXcodeTarget(config.modResults, {
      appClipName,
      appClipBundleIdentifier,
      appClipRootPath,
    });

    return config;
  });
};
