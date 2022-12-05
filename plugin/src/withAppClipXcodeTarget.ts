import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";

import {
  getAppClipBundleIdentifier,
  getAppClipFolder,
  getAppClipName,
} from ".";
import { addAppClipXcodeTarget } from "./xcodeAppClip/xcodeAppClip";

export type WithAppClipXcodeTargetConfigPluginProps = {
  name?: string;
  clipRootFolder?: string;
};

export const withAppClipXcodeTarget: ConfigPlugin<
  WithAppClipXcodeTargetConfigPluginProps
> = (config, { name, clipRootFolder }) => {
  return withXcodeProject(config, (config) => {
    const appName = config.modRequest.projectName!;
    const appClipName = name || getAppClipName(config.modRequest.projectName!);
    const appClipFolder = getAppClipFolder(config.modRequest.projectName!);
    const appClipBundleIdentifier = getAppClipBundleIdentifier(
      config.ios!.bundleIdentifier!
    );
    const platformProjectRoot = config.modRequest.platformProjectRoot;
    const currentProjectVersion = config.ios!.buildNumber || "1";
    const marketingVersion = config.version!;

    addAppClipXcodeTarget(config.modResults, {
      appName,
      appClipName,
      appClipFolder,
      appClipBundleIdentifier,
      platformProjectRoot,
      currentProjectVersion,
      marketingVersion,
      clipRootFolder,
    });

    return config;
  });
};
