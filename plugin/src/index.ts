import { ConfigPlugin, IOSConfig } from "@expo/config-plugins";

import { withAppClipAppConfig } from "./withAppClipAppConfig";
import { withAppClipAppDelegate } from "./withAppClipAppDelegate";
import { withAppClipEntitlements } from "./withAppClipEntitlements";
import { withAppClipPlist } from "./withAppClipPlist";
import { withAppClipPodfile } from "./withAppClipPodfile";
import { withAppClipXcodeTarget } from "./withAppClipXcodeTarget";
import { withAppEntitlements } from "./withAppEntitlements";

export type WithIosAppClipConfigPluginProps = {
  name?: string;
  root?: string;
};

const withIosAppClip: ConfigPlugin<WithIosAppClipConfigPluginProps> = (
  config,
  props
) => {
  config = withAppClipAppConfig(config);
  config = withAppClipAppDelegate(config);
  config = withAppClipPlist(config);
  config = withAppClipEntitlements(config);
  config = withAppClipXcodeTarget(config, {
    name: props?.name,
    clipRootFolder: props?.root,
  });
  config = withAppClipPodfile(config);
  config = withAppEntitlements(config);

  return config;
};

export default withIosAppClip;

export function getAppClipName(projectName: string) {
  return `${projectName} Clip`;
}

export function getAppClipFolder(projectName: string) {
  const sanizizedName = IOSConfig.XcodeUtils.sanitizedName(projectName);

  return `${sanizizedName}Clip`;
}

export function getAppClipBundleIdentifier(bundleIdentifier: string) {
  return `${bundleIdentifier}.Clip`;
}
