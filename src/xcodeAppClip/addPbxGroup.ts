import { XcodeProject } from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

export default function addPbxGroup(
  proj: XcodeProject,
  {
    appName,
    appClipName,
    platformProjectRoot,
  }: { appName: string; appClipName: string; platformProjectRoot: string }
) {
  // App Clip folder
  const appClipPath = path.join(platformProjectRoot, appClipName);

  // Copy Expo.plist
  const supportingPath = path.join(appClipPath, "Supporting");
  const expoPlistSource = path.join(
    platformProjectRoot,
    appName,
    "Supporting",
    "Expo.plist"
  );
  fs.mkdirSync(supportingPath);
  copyFileSync(expoPlistSource, supportingPath);

  // Copy SplashScreen.storyboard
  const splashScreenStoryboardSource = path.join(
    platformProjectRoot,
    appName,
    "SplashScreen.storyboard"
  );
  copyFileSync(splashScreenStoryboardSource, appClipPath);

  // Copy Images.xcassets
  const imagesXcassetsSource = path.join(
    platformProjectRoot,
    appName,
    "Images.xcassets"
  );

  copyFolderRecursiveSync(imagesXcassetsSource, appClipPath);

  // Add PBX group
  const { uuid: pbxGroupUuid, pbxGroup } = proj.addPbxGroup(
    [
      "AppDelegate.h",
      "AppDelegate.mm",
      "main.m",
      "Info.plist",
      "Images.xcassets",
      "SplashScreen.storyboard",
      "Supporting/Expo.plist",
      `${appClipName}.entitlements`,
    ],
    appClipName,
    appClipName
  );
  console.log(`Added PBXGroup ${pbxGroupUuid}`);

  /* let pbxGroupUuid: string | undefined = undefined;

  // Find PBXGroup
  Object.keys(groups).forEach(function (key) {
    console.log("GROUP", groups[key].name, appClipName);
    if (groups[key].name === appClipName) {
      pbxGroupUuid = key;
      console.log(`Found root PBXGroup: ${key}`);
    }
  }); */

  // Add PBXGroup to top level group
  const groups = proj.hash.project.objects["PBXGroup"];
  if (pbxGroupUuid) {
    Object.keys(groups).forEach(function (key) {
      if (groups[key].name === undefined) {
        proj.addToPbxGroup(pbxGroupUuid, key);
        console.log(
          `Added PBXGroup ${pbxGroupUuid} root PBXGroup group ${key}`
        );
      }
    });
  }
}

function copyFileSync(source: any, target: any) {
  let targetFile = target;

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source: any, target: any) {
  const targetPath = path.join(target, path.basename(source));
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const currentPath = path.join(source, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        copyFolderRecursiveSync(currentPath, targetPath);
      } else {
        copyFileSync(currentPath, targetPath);
      }
    });
  }
}
