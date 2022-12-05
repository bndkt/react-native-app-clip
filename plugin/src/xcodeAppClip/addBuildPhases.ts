import { XcodeProject } from "@expo/config-plugins";

import { PBXFile, quoted } from "./util";

export default function addBuildPhases(
  proj: XcodeProject,
  {
    groupName,
    productFile,
    targetUuid,
    clipRootFolder,
  }: {
    groupName: string;
    productFile: PBXFile;
    targetUuid: string;
    clipRootFolder?: string;
  }
) {
  const buildPath = quoted("$(CONTENTS_FOLDER_PATH)/AppClips");

  // Add shell script build phase "Start Packager"
  proj.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Start Packager",
    targetUuid,
    {
      shellPath: "/bin/sh",
      shellScript:
        'if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then\\n  source "$PODS_ROOT/../.xcode.env"\\nfi\\nif [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then\\n  source "$PODS_ROOT/../.xcode.env.local"\\nfi\\n'
          .concat(
            clipRootFolder
              ? `\\nexport EXPO_APP_CLIP_ROOT="${clipRootFolder}"`
              : ""
          )
          .concat(
            '\\nexport RCT_METRO_PORT="${RCT_METRO_PORT:=8081}"\\necho "export RCT_METRO_PORT=${RCT_METRO_PORT}" > `$NODE_BINARY --print "require(\'path\').dirname(require.resolve(\'react-native/package.json\')) + \'/scripts/.packager.env\'"`\\nif [ -z "${RCT_NO_LAUNCH_PACKAGER+xxx}" ] ; then\\n  if nc -w 5 -z localhost ${RCT_METRO_PORT} ; then\\n    if ! curl -s "http://localhost:${RCT_METRO_PORT}/status" | grep -q "packager-status:running" ; then\\n      echo "Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly"\\n      exit 2\\n    fi\\n  else\\n    open `$NODE_BINARY --print "require(\'path\').dirname(require.resolve(\'react-native/package.json\')) + \'/scripts/launchPackager.command\'"` || echo "Can\'t start packager automatically"\\n  fi\\nfi\\n'
          ),
    },
    buildPath
  );

  // Sources build phase
  proj.addBuildPhase(
    ["AppDelegate.mm", "main.m" /*, "noop-file.swift" */],
    "PBXSourcesBuildPhase",
    groupName,
    targetUuid,
    "watch2_app",
    buildPath
  );

  // Copy files build phase
  proj.addBuildPhase(
    [productFile.path],
    "PBXCopyFilesBuildPhase",
    groupName,
    proj.getFirstTarget().uuid,
    "watch2_app", // "watch2_app" uses the same subfolder spec (16), app_clip does not exist in cordova-node-xcode yet,
    buildPath
  );

  // Frameworks build phase
  proj.addBuildPhase(
    [],
    "PBXFrameworksBuildPhase",
    groupName,
    targetUuid,
    "watch2_app",
    buildPath
  );

  // Resources build phase
  proj.addBuildPhase(
    ["Images.xcassets", "SplashScreen.storyboard", "Supporting/Expo.plist"],
    "PBXResourcesBuildPhase",
    groupName,
    targetUuid,
    "watch2_app",
    buildPath
  );

  // Add shell script build phase
  proj.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Bundle React Native code and images",
    targetUuid,
    {
      shellPath: "/bin/sh",
      shellScript:
        'if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then\\n  source "$PODS_ROOT/../.xcode.env"\\nfi\\nif [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then\\n  source "$PODS_ROOT/../.xcode.env.local"\\nfi\\n\\n# The project root by default is one level up from the ios directory\\nexport PROJECT_ROOT="$PROJECT_DIR"/..'
          .concat(
            clipRootFolder
              ? `\\nexport EXPO_APP_CLIP_ROOT="${clipRootFolder}"`
              : ""
          )
          .concat(
            '\\n\\nif [[ "$CONFIGURATION" = *Debug* ]]; then\\n  export SKIP_BUNDLING=1\\nfi\\nif [[ -z "$ENTRY_FILE" ]]; then\\n  # Set the entry JS file using the bundler\'s entry resolution.\\n  export ENTRY_FILE="$("$NODE_BINARY" -e "require(\'expo/scripts/resolveAppEntry\')" $PROJECT_ROOT ios relative | tail -n 1)"\\nfi\\n\\n`"$NODE_BINARY" --print "require(\'path\').dirname(require.resolve(\'react-native/package.json\')) + \'/scripts/react-native-xcode.sh\'"`\\n\\n'
          ),
    },
    buildPath
  );
}
