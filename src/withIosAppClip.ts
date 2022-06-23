import { ConfigPlugin } from "@expo/config-plugins";

import { withAppClipAppConfig } from "./withAppClipAppConfig";
import { withAppClipAppDelegate } from "./withAppClipAppDelegate";
import { withAppClipEntitlements } from "./withAppClipEntitlements";
import { withAppClipPlist } from "./withAppClipPlist";
import { withAppClipPodfile } from "./withAppClipPodfile";
import { withAppClipXcodeTarget } from "./withAppClipXcodeTarget";
import { withAppEntitlements } from "./withAppEntitlements";
import { withAppGymfile } from "./withAppGymfile";

export type WithIosAppClipConfigPluginProps = {
  entryPoint?: string;
  name?: string;
};

const withIosAppClip: ConfigPlugin<WithIosAppClipConfigPluginProps> = (
  config,
  { entryPoint, name }
) => {
  if (entryPoint) {
    console.warn(
      "DEPRECATED: Please note that the use of the entryPoint parameter has been deprecated."
    );
  }

  config = withAppClipAppConfig(config);
  config = withAppClipAppDelegate(config);
  config = withAppClipPlist(config);
  config = withAppClipEntitlements(config);
  config = withAppClipXcodeTarget(config, { name });
  config = withAppClipPodfile(config);
  config = withAppEntitlements(config);
  config = withAppGymfile(config);

  return config;
};

export default withIosAppClip;

export function getAppClipName(projectName: string) {
  return `${projectName} Clip`;
}

export function getAppClipFolder(projectName: string) {
  return `${projectName}Clip`;
}

export function getAppClipBundleIdentifier(bundleIdentifier: string) {
  return `${bundleIdentifier}.Clip`;
}
