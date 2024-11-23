import plist from "@expo/plist";
import { withInfoPlist, type ConfigPlugin } from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

import { getAppClipEntitlements } from "./lib/getAppClipEntitlements";

export const withEntitlements: ConfigPlugin<{
  targetName: string;
  groupIdentifier: string;
  appleSignin: boolean;
  applePayMerchantIds: string[];
  pushNotifications: boolean;
}> = (
  config,
  { targetName, groupIdentifier, appleSignin, applePayMerchantIds, pushNotifications },
) => {
  return withInfoPlist(config, (config) => {
    const targetPath = path.join(
      config.modRequest.platformProjectRoot,
      targetName,
    );
    const filePath = path.join(targetPath, `${targetName}.entitlements`);

    if (config.ios === undefined) {
      throw new Error("Missing iOS config");
    }

    const appClipEntitlements = getAppClipEntitlements(config.ios, {
      groupIdentifier,
      appleSignin,
      applePayMerchantIds,
      pushNotifications,
    });

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, plist.build(appClipEntitlements));

    return config;
  });
};
