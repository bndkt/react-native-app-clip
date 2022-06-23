import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";
import * as path from "path";

import {
  getAppClipBundleIdentifier,
  getAppClipFolder,
  getAppClipName,
} from "./withIosAppClip";
import { addAppClipXcodeTarget } from "./xcodeAppClip/xcodeAppClip";

export type WithAppClipXcodeTargetConfigPluginProps = {
  name?: string;
};

export const withAppClipXcodeTarget: ConfigPlugin<
  WithAppClipXcodeTargetConfigPluginProps
> = (config, { name }) => {
  return withXcodeProject(config, (config) => {
    const appName = config.modRequest.projectName!;
    const appClipName = name || getAppClipName(config.modRequest.projectName!);
    const appClipFolder = getAppClipFolder(config.modRequest.projectName!);
    const appClipBundleIdentifier = getAppClipBundleIdentifier(
      config.ios!.bundleIdentifier!
    );
    const appClipRootPath = path.join(
      config.modRequest.platformProjectRoot,
      appClipFolder
    );
    const platformProjectRoot = config.modRequest.platformProjectRoot;
    const currentProjectVersion = config.ios!.buildNumber || "1";
    const marketingVersion = config.version!;

    addAppClipXcodeTarget(config.modResults, {
      appName,
      appClipName,
      appClipFolder,
      appClipBundleIdentifier,
      appClipRootPath,
      platformProjectRoot,
      currentProjectVersion,
      marketingVersion,
    });

    return config;
  });
};
