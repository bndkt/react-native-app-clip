import { ConfigPlugin, IOSConfig, withPlugins } from "expo/config-plugins";

import { withAppClipAppConfig } from "./withAppClipAppConfig";
import { withAppClipAppDelegate } from "./withAppClipAppDelegate";
import { withAppClipEntitlements } from "./withAppClipEntitlements";
import { withAppClipPlist } from "./withAppClipPlist";
import { withAppClipPodfile } from "./withAppClipPodfile";
import { withAppClipXcodeTarget } from "./withAppClipXcodeTarget";
import { withAppEntitlements } from "./withAppEntitlements";

const withIosAppClip: ConfigPlugin<{
  name?: string;
  root?: string;
}> = (config, props) => {
  const appClipBundleIdentifier = `${config.ios?.bundleIdentifier}.Clip`;
  const appClipFolder = `${IOSConfig.XcodeUtils.sanitizedName(
    config.name
  )}Clip`;
  const appClipName = props.name ?? `${config.name} Clip`;
  const clipRootFolder = props?.root;

  return withPlugins(config, [
    [
      withAppClipAppConfig,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
    [
      withAppClipAppDelegate,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
    [
      withAppClipPlist,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
    [
      withAppClipEntitlements,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
    [
      withAppClipXcodeTarget,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
    [
      withAppClipPodfile,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
    [
      withAppEntitlements,
      {
        appClipName,
        appClipFolder,
        appClipBundleIdentifier,
        clipRootFolder,
      },
    ],
  ]);
};

export default withIosAppClip;
