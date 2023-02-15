import plist from "@expo/plist";
import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

import { getAppClipEntitlements } from "./withAppClipAppConfig";

export const withAppClipEntitlements: ConfigPlugin<{
  appClipFolder: string;
}> = (config, { appClipFolder }) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolder
      );
      const filePath = path.join(
        appClipRootPath,
        `${appClipFolder}.entitlements`
      );

      const appClipEntitlements = getAppClipEntitlements(config.ios);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, plist.build(appClipEntitlements));

      return config;
    },
  ]);
};
