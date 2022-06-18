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

      const scheme = config.modRequest.projectName;

      const gymfileContent = `
suppress_xcode_output(true)
clean(false)

scheme("${scheme}")

configuration("Release")

export_options({
    method: "app-store",
    distributionBundleIdentifier: "com.bndkt.pepper"
})

disable_xcpretty(true)

output_directory("./build")
      `;

      await fs.promises.writeFile(gymfilePath, gymfileContent);

      return config;
    },
  ]);
};
