import { XcodeProject } from "@expo/config-plugins";

import { quoted } from "./util";

export default function (
  proj: XcodeProject,
  appClipName: string,
  appClipBundleIdentifier: string
) {
  const commonBuildSettings = {
    ASSETCATALOG_COMPILER_APPICON_NAME: "AppIcon",
    ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: "AccentColor",
    CODE_SIGN_ENTITLEMENTS: `${appClipName}/${appClipName}.entitlements`,
    CODE_SIGN_STYLE: "Automatic",
    CURRENT_PROJECT_VERSION: 1,
    INFOPLIST_FILE: `${appClipName}/Info.plist`,
    // LD_RUNPATH_SEARCH_PATHS: `("$(inherited)","@executable_path/Frameworks",)`,
    MARKETING_VERSION: "1.0",
    PRODUCT_BUNDLE_IDENTIFIER: appClipBundleIdentifier,
    PRODUCT_NAME: quoted("$(TARGET_NAME)"),
    SWIFT_EMIT_LOC_STRINGS: "YES",
    TARGETED_DEVICE_FAMILY: quoted("1,2"),
    ENABLE_PREVIEWS: "YES",
    CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER: "YES", // Added because of pods warning
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
    `Build configuration list for PBXNativeTarget ${quoted(appClipName)} `
  );

  console.log(`Added XCConfigurationList ${xCConfigurationList.uuid}`);

  return xCConfigurationList;
}
