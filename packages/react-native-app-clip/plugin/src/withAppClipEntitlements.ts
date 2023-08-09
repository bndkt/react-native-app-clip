import plist from "@expo/plist";
import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import fs from "fs";
import path from "path";

import { getAppClipEntitlements } from "./lib/getAppClipEntitlements";

export const withAppClipEntitlements: ConfigPlugin<{
  targetName: string;
  targetPath: string;
  groupIdentifier: string;
  appleSignin: boolean;
}> = (config, { targetName, groupIdentifier, appleSignin }) => {
  return withInfoPlist(config, (config) => {
    const targetPath = path.join(
      config.modRequest.platformProjectRoot,
      targetName
    );
    const filePath = path.join(targetPath, `${targetName}.entitlements`);

    const appClipEntitlements = getAppClipEntitlements(config.ios, {
      groupIdentifier,
      appleSignin,
    });

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, plist.build(appClipEntitlements));

    return config;
  });
};
