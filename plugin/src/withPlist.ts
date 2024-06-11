import plist from "@expo/plist";
import {
  type InfoPlist,
  withInfoPlist,
  type ConfigPlugin,
} from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

/**
  Add the App Clip Info.plist configuration and Expo.plist configuration.
**/
export const withPlist: ConfigPlugin<{
  targetName: string;
  deploymentTarget: string;
  requestEphemeralUserNotification: boolean;
  requestLocationConfirmation: boolean;
}> = (
  config,
  {
    targetName,
    deploymentTarget,
    requestEphemeralUserNotification,
    requestLocationConfirmation,
  },
) => {
  return withInfoPlist(config, (config) => {
    const targetPath = path.join(
      config.modRequest.platformProjectRoot,
      targetName,
    );

    // Info.plist
    const filePath = path.join(targetPath, "Info.plist");

    const infoPlist: InfoPlist = {
      NSAppClip: {
        NSAppClipRequestEphemeralUserNotification:
          requestEphemeralUserNotification,
        NSAppClipRequestLocationConfirmation: requestLocationConfirmation,
      },
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: config.developmentClient,
        NSExceptionDomains: {
          localhost: {
            NSExceptionAllowsInsecureHTTPLoads: config.developmentClient,
          },
        },
        NSAllowsLocalNetworking: config.developmentClient,
      },
      CFBundleName: "$(PRODUCT_NAME)",
      CFBundleIdentifier: "$(PRODUCT_BUNDLE_IDENTIFIER)",
      CFBundleVersion: "$(CURRENT_PROJECT_VERSION)",
      CFBundleExecutable: "$(EXECUTABLE_NAME)",
      CFBundlePackageType: "$(PRODUCT_BUNDLE_PACKAGE_TYPE)",
      CFBundleShortVersionString: config.version,
      UIViewControllerBasedStatusBarAppearance: "NO",
      UILaunchStoryboardName: "SplashScreen",
      UIRequiresFullScreen: true,
      MinimumOSVersion: deploymentTarget,
    };

    if (config.ios?.infoPlist) {
      for (const key of Object.keys(config.ios?.infoPlist)) {
        if (config.ios?.infoPlist) {
          infoPlist[key] = config.ios.infoPlist[key];
        }
      }
    }

    fs.mkdirSync(path.dirname(filePath), {
      recursive: true,
    });
    fs.writeFileSync(filePath, plist.build(infoPlist));

    // Expo.plist
    const expoPlistFilePath = path.join(targetPath, "Supporting/Expo.plist");
    const expoPlist: InfoPlist = {
      EXUpdatesRuntimeVersion: "exposdk:51.0.0", // TODO
      // EXUpdatesURL: "", // TODO
      EXUpdatesEnabled: false,
    };

    fs.mkdirSync(path.dirname(expoPlistFilePath), {
      recursive: true,
    });
    fs.writeFileSync(expoPlistFilePath, plist.build(expoPlist));

    return config;
  });
};
