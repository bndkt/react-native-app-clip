import { IOSConfig, withPlugins, type ConfigPlugin } from "@expo/config-plugins";

import { withConfig } from "./withConfig";
import { withEntitlements } from "./withEntitlements";
import { withPlist } from "./withPlist";
import { withPodfile } from "./withPodfile";
import { withXcode } from "./withXcode";

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
  expoRuntimeVersion?: string;
  infoPlistAdditionnalEntries?: Record<string,string | number | boolean | undefined >;
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
    appleSignin = false,
    applePayMerchantIds,
    excludedPackages,
    expoRuntimeVersion,
    infoPlistAdditionnalEntries,
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
        expoRuntimeVersion,
        infoPlistAdditionnalEntries
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
