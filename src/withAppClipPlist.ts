import * as fs from "fs";
import * as path from "path";
import plist from "@expo/plist";
import {
  ConfigPlugin,
  InfoPlist,
  withDangerousMod,
} from "@expo/config-plugins";

import { getAppClipBundleIdentifier, getAppClipName } from "./withIosAppClip";

export const withAppClipPlist: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appFolder = config.modRequest.projectName!;
      const appRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appFolder
      );
      const appFilePath = path.join(appRootPath, "Info.plist");

      const appClipFolderName = getAppClipName(config.modRequest.projectName!);
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolderName
      );
      const appClipFilePath = path.join(appClipRootPath, "Info.plist");
      const bundleIdentifier = getAppClipBundleIdentifier(
        config.ios!.bundleIdentifier!
      );

      const fileContent = fs.readFileSync(appFilePath).toString();
      const appClipPlist: InfoPlist = plist.parse(fileContent);
      appClipPlist.NSAppClip = {
        NSAppClipRequestEphemeralUserNotification: false,
        NSAppClipRequestLocationConfirmation: false,
      };
      appClipPlist.CFBundleIdentifier = bundleIdentifier;
      appClipPlist.CFBundleShortVersionString = "1.0.0";
      appClipPlist.CFBundleIconName = "AppIcon";

      /* const appClipPlist: InfoPlist = {
        NSAppClip: {
          NSAppClipRequestEphemeralUserNotification: false,
          NSAppClipRequestLocationConfirmation: false,
        },
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            localhost: { NSExceptionAllowsInsecureHTTPLoads: true },
          },
        },
        UIViewControllerBasedStatusBarAppearance: false,
        CFBundleVersion: "1",
        CFBundleShortVersionString: "1.0.0",
        CFBundleIdentifier: bundleIdentifier,
      }; */

      await fs.promises.mkdir(path.dirname(appClipFilePath), {
        recursive: true,
      });
      await fs.promises.writeFile(appClipFilePath, plist.build(appClipPlist));

      return config;
    },
  ]);
};
