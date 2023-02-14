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
  const commonBuildSettings: any = {
    ASSETCATALOG_COMPILER_APPICON_NAME: "AppIcon",
    CLANG_ENABLE_MODULES: "YES",
    CURRENT_PROJECT_VERSION: quoted(currentProjectVersion),
    INFOPLIST_FILE: `${appClipFolder}/Info.plist`,
    IPHONEOS_DEPLOYMENT_TARGET: "16.0",
    // LD_RUNPATH_SEARCH_PATHS: "$(inherited) @executable_path/Frameworks",
    // OTHER_LDFLAGS: `("$(inherited)","-ObjC","-lc++",)`,
    PRODUCT_BUNDLE_IDENTIFIER: quoted(appClipBundleIdentifier),
    PRODUCT_NAME: quoted(appClipName),
    SWIFT_VERSION: "5.0",
    VERSIONING_SYSTEM: quoted("apple-generic"),
    TARGETED_DEVICE_FAMILY: quoted("1,2"),
    CODE_SIGN_ENTITLEMENTS: `${appClipFolder}/${appClipFolder}.entitlements`,
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

  return xCConfigurationList;
}
