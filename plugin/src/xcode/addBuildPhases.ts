import type { XcodeProject } from "expo/config-plugins";
import util from "node:util";

export function addBuildPhases(
  xcodeProject: XcodeProject,
  {
    targetUuid,
    groupName,
    productFile,
  }: {
    targetUuid: string;
    groupName: string;
    productFile: {
      uuid: string;
      target: string;
      basename: string;
      group: string;
    };
  },
) {
  const buildPath = `"$(CONTENTS_FOLDER_PATH)/AppClips"`;
  const folderType = "watch2_app"; // "watch2_app" uses the same subfolder spec (16), app_clip does not exist in cordova-node-xcode yet

  const buildPhaseFiles = ["AppDelegate.mm", "main.m"];

  // Add shell script build phase "Start Packager"
  xcodeProject.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Start Packager",
    targetUuid,
    {
      shellPath: "/bin/sh",
      shellScript:
        'if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then\n  source "$PODS_ROOT/../.xcode.env"\nfi\nif [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then\n  source "$PODS_ROOT/../.xcode.env.local"\nfi\n\nexport RCT_METRO_PORT="${RCT_METRO_PORT:=8081}"\necho "export RCT_METRO_PORT=${RCT_METRO_PORT}" > `$NODE_BINARY --print "require(\'path\').dirname(require.resolve(\'react-native/package.json\')) + \'/scripts/.packager.env\'"`\nif [ -z "${RCT_NO_LAUNCH_PACKAGER+xxx}" ] ; then\n  if nc -w 5 -z localhost ${RCT_METRO_PORT} ; then\n    if ! curl -s "http://localhost:${RCT_METRO_PORT}/status" | grep -q "packager-status:running" ; then\n      echo "Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly"\n      exit 2\n    fi\n  else\n    open `$NODE_BINARY --print "require(\'path\').dirname(require.resolve(\'expo/package.json\')) + \'/scripts/launchPackager.command\'"` || echo "Can\'t start packager automatically"\n  fi\nfi\n',
    },
    buildPath,
  );

  // Sources build phase
  xcodeProject.addBuildPhase(
    buildPhaseFiles,
    "PBXSourcesBuildPhase",
    groupName,
    targetUuid,
    folderType,
    buildPath,
  );

  // Copy files build phase
  xcodeProject.addBuildPhase(
    [],
    "PBXCopyFilesBuildPhase",
    groupName,
    xcodeProject.getFirstTarget().uuid,
    folderType,
    buildPath,
  );

  xcodeProject
    .buildPhaseObject("PBXCopyFilesBuildPhase", groupName, productFile.target)
    .files.push({
      value: productFile.uuid,
      comment: util.format("%s in %s", productFile.basename, productFile.group), // longComment(file);
    });
  xcodeProject.addToPbxBuildFileSection(productFile);

  // Frameworks build phase
  xcodeProject.addBuildPhase(
    [],
    "PBXFrameworksBuildPhase",
    groupName,
    targetUuid,
    folderType,
    buildPath,
  );

  // Resources build phase
  xcodeProject.addBuildPhase(
    ["Images.xcassets", "SplashScreen.storyboard", "Supporting/Expo.plist"],
    "PBXResourcesBuildPhase",
    groupName,
    targetUuid,
    folderType,
    buildPath,
  );

  // Add shell script build phase
  xcodeProject.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Bundle React Native code and images",
    targetUuid,
    {
      shellPath: "/bin/sh",
      shellScript:
        'export BUILDING_FOR_APP_CLIP=1\nif [[ -f "$PODS_ROOT/../.xcode.env" ]]; then\n  source "$PODS_ROOT/../.xcode.env"\nfi\nif [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then\n  source "$PODS_ROOT/../.xcode.env.local"\nfi\n\n# The project root by default is one level up from the ios directory\nexport PROJECT_ROOT="$PROJECT_DIR"/..\n\nif [[ "$CONFIGURATION" = *Debug* ]]; then\n  export SKIP_BUNDLING=1\nfi\nif [[ -z "$ENTRY_FILE" ]]; then\n  # Set the entry JS file using the bundler\'s entry resolution.\n  export ENTRY_FILE="$("$NODE_BINARY" -e "require(\'expo/scripts/resolveAppEntry\')" "$PROJECT_ROOT" ios relative | tail -n 1)"\nfi\n\nif [[ -z "$CLI_PATH" ]]; then\n  # Use Expo CLI\n  export CLI_PATH="$("$NODE_BINARY" --print "require.resolve(\'@expo/cli\')")"\nfi\nif [[ -z "$BUNDLE_COMMAND" ]]; then\n  # Default Expo CLI command for bundling\n  export BUNDLE_COMMAND="export:embed"\nfi\n\n`"$NODE_BINARY" --print "require(\'path\').dirname(require.resolve(\'react-native/package.json\')) + \'/scripts/react-native-xcode.sh\'"`\n\n',
    },
    buildPath,
  );
}
