import { IOSConfig, withPlugins, type ConfigPlugin } from "expo/config-plugins";

import { withConfig } from "./withConfig";
import { withEntitlements } from "./withEntitlements";
import { withPlist } from "./withPlist";
import { withPodfile } from "./withPodfile";
import { withXcode } from "./withXcode";
import { withDeviceFamily } from "@expo/config-plugins/build/ios/DeviceFamily";

const withAppClip: ConfigPlugin<{
  name?: string;
  bundleIdSuffix?: string;
  targetSuffix?: string;
  groupIdentifier?: string;
  deploymentTarget?: string;
  requestEphemeralUserNotification?: boolean;
  requestLocationConfirmation?: boolean;
  appleSignin?: boolean;
  applePayMerchantIds?: string[];
  excludedPackages?: string[];
}> = (
  config,
  {
    name,
    bundleIdSuffix,
    targetSuffix,
    groupIdentifier,
    deploymentTarget,
    requestEphemeralUserNotification,
    requestLocationConfirmation,
    appleSignin,
    applePayMerchantIds,
    excludedPackages,
  } = {},
) => {
  name ??= "Clip";
  bundleIdSuffix ??= "Clip";
  targetSuffix ??= "Clip";
  deploymentTarget ??= "14.0";
  appleSignin ??= false;

  if (!config.ios?.bundleIdentifier) {
    throw new Error("No bundle identifier specified in app config");
  }

  const bundleIdentifier = `${config.ios.bundleIdentifier}.${bundleIdSuffix}`;
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(config.name)}${targetSuffix}`;

  const modifiedConfig = withPlugins(config, [
    withDeviceFamily as ConfigPlugin,
    [
      withConfig,
      { targetName, bundleIdentifier, appleSignin, applePayMerchantIds },
    ],
    [
      withEntitlements,
      { targetName, groupIdentifier, appleSignin, applePayMerchantIds },
    ],
    [withPodfile, { targetName, excludedPackages }],
    [
      withPlist,
      {
        targetName,
        deploymentTarget,
        requestEphemeralUserNotification,
        requestLocationConfirmation,
      },
    ],
    [
      withXcode,
      {
        name,
        targetName,
        bundleIdentifier,
        deploymentTarget,
      },
    ],
  ]);

  return modifiedConfig;
};

export default withAppClip;
