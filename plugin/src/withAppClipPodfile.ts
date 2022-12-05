import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import * as fs from "fs";
import * as path from "path";

import { getAppClipFolder } from ".";

export const withAppClipPodfile: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const appClipFolderName = getAppClipFolder(
        config.modRequest.projectName!
      );

      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const podFileContent = fs.readFileSync(podFilePath).toString();

      const modifiedPodfile = mergeContents({
        tag: "withAppClipPodfile",
        src: podFileContent,
        newSrc: `  target '${appClipFolderName}' do\n  end`,
        anchor: /post_install/,
        offset: 0,
        comment: "#",
      });

      await fs.promises.writeFile(podFilePath, modifiedPodfile.contents);

      return config;
    },
  ]);
};
