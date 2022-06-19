import { XcodeProject } from "@expo/config-plugins";

import { quoted } from "./util";

export default function (
  proj: XcodeProject,
  {
    appClipFolder,
    appClipBundleIdentifier,
    currentProjectVersion,
    marketingVersion,
    appClipName,
  }: {
    appClipFolder: string;
    appClipBundleIdentifier: string;
    currentProjectVersion: string;
    marketingVersion: string;
    appClipName: string;
  }
) {
  const commonBuildSettings = {
    ASSETCATALOG_COMPILER_APPICON_NAME: "AppIcon",
    ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: "AccentColor",
    CODE_SIGN_ENTITLEMENTS: `${appClipFolder}/${appClipFolder}.entitlements`,
    CODE_SIGN_STYLE: "Automatic",
    CURRENT_PROJECT_VERSION: quoted(currentProjectVersion),
    INFOPLIST_FILE: `${appClipFolder}/Info.plist`,
    // LD_RUNPATH_SEARCH_PATHS: `("$(inherited)","@executable_path/Frameworks",)`,
    MARKETING_VERSION: quoted(marketingVersion),
    PRODUCT_BUNDLE_IDENTIFIER: appClipBundleIdentifier,
    PRODUCT_NAME: quoted(appClipName),
    SWIFT_EMIT_LOC_STRINGS: "YES",
    TARGETED_DEVICE_FAMILY: quoted("1,2"),
    ENABLE_PREVIEWS: "YES",
  };

  const buildConfigurationsList = [
    {
      name: "Debug",
      isa: "XCBuildConfiguration",
      buildSettings: {
        ...commonBuildSettings,
      },
    },
    {
      name: "Release",
      isa: "XCBuildConfiguration",
      buildSettings: {
        ...commonBuildSettings,
      },
    },
  ];

  const xCConfigurationList = proj.addXCConfigurationList(
    buildConfigurationsList,
    "Release",
    `Build configuration list for PBXNativeTarget ${quoted(appClipFolder)} `
  );

  console.log(`Added XCConfigurationList ${xCConfigurationList.uuid}`);

  return xCConfigurationList;
}
