import {
  ConfigPlugin,
  InfoPlist,
  withEntitlementsPlist,
} from "@expo/config-plugins";
import plist from "@expo/plist";
import * as fs from "fs";
import * as path from "path";

import { getAppClipFolder } from "./withIosAppClip";

export const withAppClipEntitlements: ConfigPlugin = (config) => {
  return withEntitlementsPlist(config, (config) => {
    const bundleIdentifier = config.ios!.bundleIdentifier!;
    const appClipFolderName = getAppClipFolder(config.modRequest.projectName!);
    const appClipRootPath = path.join(
      config.modRequest.platformProjectRoot,
      appClipFolderName
    );
    const filePath = path.join(
      appClipRootPath,
      `${appClipFolderName}.entitlements`
    );

    const appClipPlist: InfoPlist = Object.assign({}, config.modResults);

    appClipPlist[
      "com.apple.developer.parent-application-identifiers"
    ] = `$(AppIdentifierPrefix)${bundleIdentifier}`;

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, plist.build(appClipPlist));

    return config;
  });
};
