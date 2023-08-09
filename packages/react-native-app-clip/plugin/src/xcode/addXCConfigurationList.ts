import { XcodeProject } from "@expo/config-plugins";

export function addXCConfigurationList(
  xcodeProject: XcodeProject,
  {
    name,
    targetName,
    currentProjectVersion,
    bundleIdentifier,
    deploymentTarget,
  }: {
    name: string;
    targetName: string;
    currentProjectVersion: string;
    bundleIdentifier: string;
    deploymentTarget: string;
  }
) {
  const commonBuildSettings: any = {
    ASSETCATALOG_COMPILER_APPICON_NAME: "AppIcon",
    CLANG_ENABLE_MODULES: "YES",
    CURRENT_PROJECT_VERSION: `"${currentProjectVersion}"`,
    INFOPLIST_FILE: `${targetName}/Info.plist`,
    IPHONEOS_DEPLOYMENT_TARGET: `"${deploymentTarget}"`,
    // LD_RUNPATH_SEARCH_PATHS: "$(inherited) @executable_path/Frameworks",
    // OTHER_LDFLAGS: `("$(inherited)","-ObjC","-lc++",)`,
    PRODUCT_BUNDLE_IDENTIFIER: `"${bundleIdentifier}"`,
    PRODUCT_NAME: `"${name}"`,
    SWIFT_VERSION: "5.0",
    VERSIONING_SYSTEM: `"apple-generic"`,
    TARGETED_DEVICE_FAMILY: `"1,2"`,
    CODE_SIGN_ENTITLEMENTS: `${targetName}/${targetName}.entitlements`,
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

  const xCConfigurationList = xcodeProject.addXCConfigurationList(
    buildConfigurationsList,
    "Release",
    `Build configuration list for PBXNativeTarget "${targetName}"`
  );

  return xCConfigurationList;
}
