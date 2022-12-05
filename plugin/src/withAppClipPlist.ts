import {
  ConfigPlugin,
  InfoPlist,
  withDangerousMod,
} from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";

import { getAppClipFolder } from ".";

export const withAppClipPlist: ConfigPlugin = (config) => {
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
      const appClipInfoPlistFilePath = path.join(appClipRootPath, "Info.plist");

      const appClipInfoPlist: InfoPlist = {};

      appClipInfoPlist.NSAppClip = {
        NSAppClipRequestEphemeralUserNotification: false,
        NSAppClipRequestLocationConfirmation: false,
      };
      appClipInfoPlist.NSAppTransportSecurity = {
        NSAllowsArbitraryLoads: true,
        NSExceptionDomains: {
          localhost: { NSExceptionAllowsInsecureHTTPLoads: true },
        },
      };

      appClipInfoPlist.CFBundleName = "$(PRODUCT_NAME)";
      appClipInfoPlist.CFBundleIdentifier = "$(PRODUCT_BUNDLE_IDENTIFIER)";
      appClipInfoPlist.CFBundleVersion = "$(CURRENT_PROJECT_VERSION)";
      appClipInfoPlist.CFBundleExecutable = "$(EXECUTABLE_NAME)";
      appClipInfoPlist.CFBundlePackageType = "$(PRODUCT_BUNDLE_PACKAGE_TYPE)";
      appClipInfoPlist.CFBundleShortVersionString = config.version;
      appClipInfoPlist.UIViewControllerBasedStatusBarAppearance = "NO";
      appClipInfoPlist.UILaunchStoryboardName = "SplashScreen";
      appClipInfoPlist.UIRequiresFullScreen = true;
      appClipInfoPlist.MinimumOSVersion = "14.0.0";

      config.ios?.infoPlist &&
        Object.keys(config.ios?.infoPlist).forEach((key: string) => {
          config.ios?.infoPlist &&
            (appClipInfoPlist[key] = config.ios.infoPlist[key]);
        });

      await fs.promises.mkdir(path.dirname(appClipInfoPlistFilePath), {
        recursive: true,
      });
      await fs.promises.writeFile(
        appClipInfoPlistFilePath,
        plist.build(appClipInfoPlist)
      );

      const appClipExpoPlistFilePath = path.join(
        appClipRootPath,
        "Supporting/Expo.plist"
      );
      const appClipExpoPlist: InfoPlist = {};
      appClipExpoPlist.EXUpdatesRuntimeVersion = "exposdk:47.0.0";
      /* appClipExpoPlist.EXUpdatesURL =
        "https://u.expo.dev/0697085b-3043-46d0-a3ad-1677246578ec"; // TODO */
      appClipExpoPlist.EXUpdatesEnabled = false;

      await fs.promises.mkdir(path.dirname(appClipExpoPlistFilePath), {
        recursive: true,
      });
      await fs.promises.writeFile(
        appClipExpoPlistFilePath,
        plist.build(appClipExpoPlist)
      );

      return config;
    },
  ]);
};
