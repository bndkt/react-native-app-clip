import { ConfigPlugin, withXcodeProject } from "expo/config-plugins";

import { addAppClipXcodeTarget } from "./xcodeAppClip";

export const withAppClipXcodeTarget: ConfigPlugin<{
  appClipName: string;
  appClipBundleIdentifier: string;
  appClipFolder: string;
  clipRootFolder?: string;
}> = (
  config,
  { clipRootFolder, appClipBundleIdentifier, appClipFolder, appClipName }
) => {
  return withXcodeProject(config, (config) => {
    const appName = config.modRequest.projectName!;
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
