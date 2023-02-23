import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

export const withPodfile: ConfigPlugin<{ targetName: string }> = (
  config,
  { targetName }
) => {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const podFileContent = fs.readFileSync(podFilePath).toString();

      const modifiedPodfile = mergeContents({
        tag: "withAppClipPodfile",
        src: podFileContent,
        newSrc: `  target '${targetName}' do\n  end`,
        anchor: /post_install/,
        offset: 0,
        comment: "#",
      });

      fs.writeFileSync(podFilePath, modifiedPodfile.contents);

      return config;
    },
  ]);
};
