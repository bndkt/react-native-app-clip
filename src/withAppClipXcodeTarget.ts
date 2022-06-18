import { ConfigPlugin, withXcodeProject } from "@expo/config-plugins";
import * as path from "path";

import { getAppClipBundleIdentifier, getAppClipName } from "./withIosAppClip";
import { addAppClipXcodeTarget } from "./xcodeAppClip/xcodeAppClip";

export type WithAppClipXcodeTargetConfigPluginProps = { entryPoint?: string };

export const withAppClipXcodeTarget: ConfigPlugin<
  WithAppClipXcodeTargetConfigPluginProps
> = (config, { entryPoint = "index.appclip" }) => {
  return withXcodeProject(config, (config) => {
    const appName = config.modRequest.projectName!;
    const appClipName = getAppClipName(config.modRequest.projectName!);
    const appClipBundleIdentifier = getAppClipBundleIdentifier(
      config.ios!.bundleIdentifier!
    );
    const appClipRootPath = path.join(
      config.modRequest.platformProjectRoot,
      appClipName
    );
    const platformProjectRoot = config.modRequest.platformProjectRoot;
    const currentProjectVersion = config.ios!.buildNumber || "1";
    const marketingVersion = config.version!;

    addAppClipXcodeTarget(config.modResults, {
      appName,
      appClipName,
      appClipBundleIdentifier,
      appClipRootPath,
      platformProjectRoot,
      currentProjectVersion,
      marketingVersion,
      entryPoint,
    });

    return config;
  });
};
