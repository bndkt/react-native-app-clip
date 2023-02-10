import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import * as fs from "fs";
import * as path from "path";

import { getAppClipFolder } from ".";

type MergeInstruction = {
  tag: string;
  newSrc: string;
  anchor: string | RegExp;
  offset: number;
};

type FilesToCopy = {
  name: string;
  replacements?: { searchValue: string; replaceValue: string }[];
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
          /* merges: [
            {
              tag: "withAppClipDelegate-1",
              newSrc: 'self.initialProps = @{@"isClip": @true};',
              anchor: /self.initialProps = @{};/, // \
              offset: 1,
            },
          ], */
          replacements: [
            {
              searchValue: `self.initialProps = @{};`,
              replaceValue: `self.initialProps = @{@"isClip": @true};`,
            },
          ],
        },
        { name: "main.m" },
      ];

      filesToCopy.forEach(async (file) => {
        const sourceFilePath = path.join(appRootPath, file.name);
        let fileContent = fs.readFileSync(sourceFilePath).toString();
        file.merges?.forEach((merge) => {
          fileContent = mergeContents({
            tag: merge.tag,
            src: fileContent,
            newSrc: merge.newSrc,
            anchor: merge.anchor,
            offset: merge.offset,
            comment: "//",
          }).contents;
        });
        file.replacements?.forEach(({ searchValue, replaceValue }) => {
          fileContent = fileContent.replace(searchValue, replaceValue);
        });
        const destinationFilePath = path.join(appClipRootPath, file.name);
        await fs.promises.writeFile(destinationFilePath, fileContent);
      });

      return config;
    },
  ]);
};
