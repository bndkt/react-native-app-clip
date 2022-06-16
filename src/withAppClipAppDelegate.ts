import * as fs from "fs";
import * as path from "path";
import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";

import { getAppClipName } from "./withIosAppClip";

export type WithAppClipAppDelegateConfigPluginProps = { entryPoint?: string };

type FilesToCopy = {
  name: string;
  replacements?: { regexp: string; newSubstr: string }[];
}[];

export const withAppClipAppDelegate: ConfigPlugin<
  WithAppClipAppDelegateConfigPluginProps
> = (config, { entryPoint = "index.appclip" }) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appFolder = config.modRequest.projectName!;
      const appRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appFolder
      );
      const appClipFolderName = getAppClipName(config.modRequest.projectName!);
      const appClipRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appClipFolderName
      );

      await fs.promises.mkdir(appClipRootPath, { recursive: true });

      const filesToCopy: FilesToCopy = [
        { name: "AppDelegate.h" },
        {
          name: "AppDelegate.mm",
          replacements: [
            {
              regexp: `jsBundleURLForBundleRoot:@"index"`,
              newSubstr: `jsBundleURLForBundleRoot:@"${entryPoint}"`,
            },
          ],
        },
        { name: "main.m" },
      ];

      filesToCopy.forEach(async (file) => {
        const sourceFilePath = path.join(appRootPath, file.name);
        let fileContent = fs.readFileSync(sourceFilePath).toString();
        file.replacements?.forEach((replacement) => {
          fileContent = fileContent.replace(
            replacement.regexp,
            replacement.newSubstr
          );
        });
        const destinationFilePath = path.join(appClipRootPath, file.name);
        await fs.promises.writeFile(destinationFilePath, fileContent);
      });

      return config;
    },
  ]);
};
