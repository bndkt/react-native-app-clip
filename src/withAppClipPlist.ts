import * as fs from "fs";
import * as path from "path";
import plist from "@expo/plist";
import {
  ConfigPlugin,
  InfoPlist,
  withDangerousMod,
} from "@expo/config-plugins";

import { getAppClipName } from "./withAppClipXcodeTarget";

export const withAppClipPlist: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appClipFolderName = getAppClipName(config.modRequest.projectName!);
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolderName
      );
      const filePath = path.join(appClipRootPath, "Info.plist");

      const appClipPlist: InfoPlist = {
        NSAppClip: {
          NSAppClipRequestEphemeralUserNotification: false,
          NSAppClipRequestLocationConfirmation: false,
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
            NSExceptionDomains: {
              localhost: { NSExceptionAllowsInsecureHTTPLoads: true },
            },
          },
          UIViewControllerBasedStatusBarAppearance: false,
        },
      };

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, plist.build(appClipPlist));

      return config;
    },
  ]);
};
