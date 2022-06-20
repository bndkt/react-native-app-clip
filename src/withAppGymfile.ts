import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

export const withAppGymfile: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const gymfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Gymfile"
      );

      // const scheme = config.modRequest.projectName;
      const appBundleIdentifier = config.ios!.bundleIdentifier!;

      const gymfileContent = `
export_options({
    distributionBundleIdentifier: "${appBundleIdentifier}"
})
output_directory("./build")
      `;

      await fs.promises.writeFile(gymfilePath, gymfileContent);

      return config;
    },
  ]);
};
