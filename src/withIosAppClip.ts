import { ConfigPlugin } from "@expo/config-plugins";

import { withAppClipAppDelegate } from "./withAppClipAppDelegate";
import { withAppClipPlist } from "./withAppClipPlist";
import { withAppClipEntitlements } from "./withAppClipEntitlements";
import { withAppClipXcodeTarget } from "./withAppClipXcodeTarget";
import { withAppClipPodfile } from "./withAppClipPodfile";
import { withAppEntitlements } from "./withAppEntitlements";

export type WithIosAppClipConfigPluginProps = { entryPoint?: string };

const withIosAppClip: ConfigPlugin<WithIosAppClipConfigPluginProps> = (
  config,
  { entryPoint }
) => {
  config = withAppClipAppDelegate(config, { entryPoint });
  config = withAppClipPlist(config);
  config = withAppClipEntitlements(config);
  config = withAppClipXcodeTarget(config);
  config = withAppClipPodfile(config);
  config = withAppEntitlements(config);

  return config;
};

export default withIosAppClip;

export function getAppClipName(projectName: string) {
  return `${projectName}Clip`;
}

export function getAppClipBundleIdentifier(bundleIdentifier: string) {
  return `${bundleIdentifier}.Clip`;
}
