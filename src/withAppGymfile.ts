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

      const appBundleIdentifier = config.ios!.bundleIdentifier!;

      const gymfileContent = `
suppress_xcode_output(true)
clean(true)
export_options({
    distributionBundleIdentifier: "${appBundleIdentifier}"
})
disable_xcpretty(true)
output_directory("./build")
      `;

      await fs.promises.writeFile(gymfilePath, gymfileContent);

      return config;
    },
  ]);
};
