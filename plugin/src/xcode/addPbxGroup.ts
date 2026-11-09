import type { XcodeProject } from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

export function addPbxGroup(
  xcodeProject: XcodeProject,
  {
    projectName,
    targetName,
    platformProjectRoot,
    appIconFileName,
  }: {
    projectName: string;
    targetName: string;
    platformProjectRoot: string;
    appIconFileName?: string;
  },
) {
  const targetPath = path.join(platformProjectRoot, targetName);

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const sourceFiles = ["AppDelegate.swift"];
  if (
    fs.existsSync(
      path.join(platformProjectRoot, projectName, "SceneDelegate.swift"),
    )
  ) {
    sourceFiles.push("SceneDelegate.swift");
  }

  const filesToCopy = ["SplashScreen.storyboard", ...sourceFiles];

  for (const file of filesToCopy) {
    const source = path.join(platformProjectRoot, projectName, file);
    copyFileSync(source, targetPath);
  }

  // Copy Images.xcassets
  const imagesXcassetsSource = path.join(
    platformProjectRoot,
    projectName,
    "Images.xcassets",
  );
  copyFolderRecursiveSync(imagesXcassetsSource, targetPath);

  if (appIconFileName) {
    fs.cpSync(
      path.join(platformProjectRoot, projectName, appIconFileName),
      path.join(targetPath, appIconFileName),
      { recursive: true },
    );
  }

  // Add PBX group
  const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup(
    [
      ...sourceFiles,
      "Info.plist",
      "Images.xcassets",
      "SplashScreen.storyboard",
      `${targetName}.entitlements`,
      "Supporting/Expo.plist",
      /* "main.jsbundle", */
    ],
    targetName,
    targetName,
  );

  // Add PBXGroup to top level group
  const groups = xcodeProject.hash.project.objects.PBXGroup;
  if (pbxGroupUuid) {
    for (const key of Object.keys(groups)) {
      if (groups[key].name === undefined && groups[key].path === undefined) {
        xcodeProject.addToPbxGroup(pbxGroupUuid, key);
      }
    }
  }

  return sourceFiles;
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
    for (const file of files) {
      const currentPath = path.join(source, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        copyFolderRecursiveSync(currentPath, targetPath);
      } else {
        copyFileSync(currentPath, targetPath);
      }
    }
  }
}
