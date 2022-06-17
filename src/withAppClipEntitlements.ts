import {
  ConfigPlugin,
  InfoPlist,
  withDangerousMod,
} from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";

import { getAppClipName } from "./withIosAppClip";

export const withAppClipEntitlements: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const bundleIdentifier = config.ios!.bundleIdentifier!;
      const appClipFolderName = getAppClipName(config.modRequest.projectName!);
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolderName
      );
      const filePath = path.join(
        appClipRootPath,
        `${appClipFolderName}.entitlements`
      );

      const appClipPlist: InfoPlist = {
        "com.apple.developer.parent-application-identifiers": [
          `$(AppIdentifierPrefix)${bundleIdentifier}`,
        ],
      };

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, plist.build(appClipPlist));

      return config;
    },
  ]);
};
