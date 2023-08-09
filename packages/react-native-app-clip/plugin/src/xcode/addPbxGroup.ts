import { XcodeProject } from "@expo/config-plugins";
import fs from "fs";
import path from "path";

export function addPbxGroup(
  xcodeProject: XcodeProject,
  {
    projectName,
    targetName,
    platformProjectRoot,
  }: { projectName: string; targetName: string; platformProjectRoot: string }
) {
  const targetPath = path.join(platformProjectRoot, targetName);

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const filesToCopy = [
    "SplashScreen.storyboard",
    "AppDelegate.h",
    "AppDelegate.mm",
    "main.m",
  ];

  filesToCopy.forEach((file) => {
    const source = path.join(platformProjectRoot, projectName, file);
    copyFileSync(source, targetPath);
  });

  // Copy Images.xcassets
  const imagesXcassetsSource = path.join(
    platformProjectRoot,
    projectName,
    "Images.xcassets"
  );
  copyFolderRecursiveSync(imagesXcassetsSource, targetPath);

  // Add PBX group
  const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup(
    [
      "AppDelegate.h",
      "AppDelegate.mm",
      "main.m",
      "Info.plist",
      "Images.xcassets",
      "SplashScreen.storyboard",
      `${targetName}.entitlements`,
      "Supporting/Expo.plist",
      /* "main.jsbundle", */
    ],
    targetName,
    targetName
  );

  // Add PBXGroup to top level group
  const groups = xcodeProject.hash.project.objects["PBXGroup"];
  if (pbxGroupUuid) {
    Object.keys(groups).forEach(function (key) {
      if (groups[key].name === undefined && groups[key].path === undefined) {
        xcodeProject.addToPbxGroup(pbxGroupUuid, key);
      }
    });
  }
}

function copyFileSync(source: string, target: string) {
  let targetFile = target;

  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source: string, target: string) {
  const targetPath = path.join(target, path.basename(source));
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
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
