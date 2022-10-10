import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";
import { getAppClipEntitlements } from "./withAppClipAppConfig";

import { getAppClipFolder } from "./withIosAppClip";

export const withAppClipEntitlements: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appClipFolderName = getAppClipFolder(
        config.modRequest.projectName!
      );
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolderName
      );
      const filePath = path.join(
        appClipRootPath,
        `${appClipFolderName}.entitlements`
      );

      const appClipEntitlements = getAppClipEntitlements(config.ios);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, plist.build(appClipEntitlements));

      return config;
    },
  ]);
};
