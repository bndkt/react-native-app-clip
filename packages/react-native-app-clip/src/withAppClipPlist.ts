import {
  ConfigPlugin,
  InfoPlist,
  withDangerousMod,
} from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";

import { getAppClipFolder } from "./withIosAppClip";

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
      const appClipFilePath = path.join(appClipRootPath, "Info.plist");

      const appClipPlist: InfoPlist = config.ios?.infoPlist ?? {};

      appClipPlist.NSAppClip = {
        NSAppClipRequestEphemeralUserNotification: false,
        NSAppClipRequestLocationConfirmation: false,
      };
      appClipPlist.NSAppTransportSecurity = {
        NSAllowsArbitraryLoads: true,
        NSExceptionDomains: {
          localhost: { NSExceptionAllowsInsecureHTTPLoads: true },
        },
      };

      appClipPlist.CFBundleName = "$(PRODUCT_NAME)";
      appClipPlist.CFBundleIdentifier = "$(PRODUCT_BUNDLE_IDENTIFIER)";
      appClipPlist.CFBundleVersion = "$(CURRENT_PROJECT_VERSION)";
      appClipPlist.CFBundleExecutable = "$(EXECUTABLE_NAME)";
      appClipPlist.CFBundlePackageType = "$(PRODUCT_BUNDLE_PACKAGE_TYPE)";
      appClipPlist.CFBundleShortVersionString = "$(MARKETING_VERSION)";
      appClipPlist.UIViewControllerBasedStatusBarAppearance = "NO";
      appClipPlist.UILaunchStoryboardName = "SplashScreen";
      appClipPlist.UIRequiresFullScreen = true;
      appClipPlist.MinimumOSVersion = "14.0.0";

      await fs.promises.mkdir(path.dirname(appClipFilePath), {
        recursive: true,
      });
      await fs.promises.writeFile(appClipFilePath, plist.build(appClipPlist));

      return config;
    },
  ]);
};
