import { XcodeProject } from "@expo/config-plugins";

import { PBXFile, quoted } from "./util";

export default function addBuildPhases(
  proj: XcodeProject,
  {
    groupName,
    productFile,
    targetUuid,
    entryPoint,
  }: {
    groupName: string;
    productFile: PBXFile;
    targetUuid: string;
    entryPoint: string;
  }
) {
  const buildPath = quoted("$(CONTENTS_FOLDER_PATH)/AppClips");

  // Add shell script build phase "Start Packager"
  const { uuid: startPackagerShellScriptBuildPhaseUuid } = proj.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Start Packager",
    targetUuid,
    {
      shellPath: "/bin/sh",
      shellScript: `export RCT_METRO_PORT=\"\${RCT_METRO_PORT:=8081}\"\\necho \"export RCT_METRO_PORT=\${RCT_METRO_PORT}\" > \`node --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/.packager.env'\"\`\\nif [ -z \"\${RCT_NO_LAUNCH_PACKAGER+xxx}\" ] ; then\\n  if nc -w 5 -z localhost \${RCT_METRO_PORT} ; then\\n    if ! curl -s \"http://localhost:\${RCT_METRO_PORT}/status\" | grep -q \"packager-status:running\" ; then\\n      echo \"Port \${RCT_METRO_PORT} already in use, packager is either not running or not running correctly\"\\n      exit 2\\n    fi\\n  else\\n    open \`node --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/launchPackager.command'\"\` || echo \"Can't start packager automatically\"\\n  fi\\nfi\\n`,
    },
    buildPath
  );
  console.log(
    `Added PBXShellScriptBuildPhase ${startPackagerShellScriptBuildPhaseUuid}`
  );

  // Copy files build phase
  const { uuid: copyFilesBuildPhaseUuid } = proj.addBuildPhase(
    [productFile.path],
    "PBXCopyFilesBuildPhase",
    groupName,
    proj.getFirstTarget().uuid,
    "watch2_app", // "watch2_app" uses the same subfolder spec (16), app_clip does not exist in cordova-node-xcode yet,
    buildPath
  );
  console.log(`Added PBXCopyFilesBuildPhase ${copyFilesBuildPhaseUuid}`);

  // Resources build phase
  const { uuid: resourcesBuildPhaseUuid } = proj.addBuildPhase(
    ["Images.xcassets", "SplashScreen.storyboard", "Supporting/Expo.plist"],
    "PBXResourcesBuildPhase",
    groupName,
    targetUuid,
    "watch2_app",
    buildPath
  );
  console.log(`Added PBXResourcesBuildPhase ${resourcesBuildPhaseUuid}`);

  // Sources build phase
  const { uuid: sourcesBuildPhaseUuid } = proj.addBuildPhase(
    ["AppDelegate.h", "AppDelegate.mm", "main.m"],
    "PBXSourcesBuildPhase",
    groupName,
    targetUuid,
    "watch2_app",
    buildPath
  );
  console.log(`Added PBXSourcesBuildPhase ${sourcesBuildPhaseUuid}`);

  // Add shell script build phase
  const { uuid: bundleShellScriptBuildPhaseUuid } = proj.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Bundle React Native code and images",
    targetUuid,
    {
      shellPath: "/bin/sh",
      shellScript: `export NODE_BINARY=node\\nexport ENTRY_FILE=${entryPoint}\\n\\n# The project root by default is one level up from the ios directory\\nexport PROJECT_ROOT=\"$PROJECT_DIR\"/..\\n\\n\`node --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\"\`\\n`,
    },
    buildPath
  );
  console.log(
    `Added PBXShellScriptBuildPhase ${bundleShellScriptBuildPhaseUuid}`
  );
}
