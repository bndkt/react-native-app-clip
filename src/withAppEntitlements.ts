import {
  ConfigPlugin,
  InfoPlist,
  withDangerousMod,
  withEntitlementsPlist,
} from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";

import { getAppClipBundleIdentifier, getAppClipFolder } from "./withIosAppClip";

export const withAppEntitlements: ConfigPlugin = (config) => {
  return withEntitlementsPlist(config, (config) => {
    const bundleIdentifier = getAppClipBundleIdentifier(
      config.ios!.bundleIdentifier!
    );

    // Write App Clip entitlements file
    const appClipFolderName = getAppClipFolder(config.modRequest.projectName!);
    const appClipRootPath = path.join(
      config.modRequest.platformProjectRoot,
      appClipFolderName
    );
    const filePath = path.join(
      appClipRootPath,
      `${appClipFolderName}.entitlements`
    );

    const appClipPlist: InfoPlist = config.modResults;

    console.log("appclipent", config.ios?.entitlements);

    fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    fs.promises.writeFile(filePath, plist.build(appClipPlist));

    // Add associated app clip identifier
    config.modResults[
      "com.apple.developer.associated-appclip-app-identifiers"
    ] = [`$(AppIdentifierPrefix)${bundleIdentifier}`];

    return config;
  });
};
