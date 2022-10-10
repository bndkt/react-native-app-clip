import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import * as fs from "fs";
import * as path from "path";

import { getAppClipFolder } from "./withIosAppClip";

type MergeInstruction = {
  tag: string;
  newSrc: string;
  anchor: string | RegExp;
  offset: number;
};

type FilesToCopy = {
  name: string;
  replacements?: { regexp: string; newSubstr: string }[];
  merges?: MergeInstruction[];
}[];

export const withAppClipAppDelegate: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appFolder = config.modRequest.projectName!;
      const appRootPath = path.join(
        config.modRequest.platformProjectRoot,
        appFolder
      );
      const appClipFolderName = getAppClipFolder(
        config.modRequest.projectName!
      );
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
            // Expo < 46
            {
              regexp: `initialProperties:nil`,
              newSubstr: `initialProperties:@{@"isClip" : @true}`,
            },
          ],
          merges: [
            // Expo >= 46
            {
              tag: "withAppClipDelegate-1",
              newSrc: 'initProps[@"isClip"] = @true;',
              anchor:
                /NSMutableDictionary \*initProps = \[NSMutableDictionary new\]/,
              offset: 1,
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
        file.merges?.forEach((merge) => {
          const mergeResult = mergeContents({
            tag: merge.tag,
            src: fileContent,
            newSrc: merge.newSrc,
            anchor: merge.anchor,
            offset: merge.offset,
            comment: "//",
          });
          fileContent = mergeResult.contents;
        });
        const destinationFilePath = path.join(appClipRootPath, file.name);
        await fs.promises.writeFile(destinationFilePath, fileContent);
      });

      return config;
    },
  ]);
};
