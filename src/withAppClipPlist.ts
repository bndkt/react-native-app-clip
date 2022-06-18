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
      /* const appFolder = config.modRequest.projectName!;
      const appRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appFolder
      );
      const appFilePath = path.join(appRootPath, "Info.plist"); */

      const appClipFolderName = getAppClipFolder(
        config.modRequest.projectName!
      );
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolderName
      );
      const appClipFilePath = path.join(appClipRootPath, "Info.plist");
      /* const bundleIdentifier = getAppClipBundleIdentifier(
        config.ios!.bundleIdentifier!
      ); */

      /* const fileContent = fs.readFileSync(appFilePath).toString();
      const appClipPlist: InfoPlist = plist.parse(fileContent);
      appClipPlist.NSAppClip = {
        NSAppClipRequestEphemeralUserNotification: false,
        NSAppClipRequestLocationConfirmation: false,
      }; */

      const appClipPlist: InfoPlist = {
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

      await fs.promises.mkdir(path.dirname(appClipFilePath), {
        recursive: true,
      });
      await fs.promises.writeFile(appClipFilePath, plist.build(appClipPlist));

      return config;
    },
  ]);
};
