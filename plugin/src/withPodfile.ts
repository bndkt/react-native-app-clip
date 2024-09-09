import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { type ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

export const withPodfile: ConfigPlugin<{
  targetName: string;
  excludedPackages?: string[];
}> = (config, { targetName, excludedPackages }) => {
  // return config;

  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile",
      );
      let podfileContent = fs.readFileSync(podFilePath).toString();

      const useExpoModules =
        excludedPackages && excludedPackages.length > 0
          ? `exclude = ["${excludedPackages.join(`", "`)}"]
      use_expo_modules!(exclude: exclude)`
          : "use_expo_modules!";

      const appClipTarget = `
        target '${targetName}' do
          ${useExpoModules}
          config = use_native_modules!

          use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
          use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']

          use_react_native!(
            :path => config[:reactNativePath],
            :hermes_enabled => podfile_properties['expo.jsEngine'] == nil || podfile_properties['expo.jsEngine'] == 'hermes',
            # An absolute path to your application root.
            :app_path => "#{Pod::Config.instance.installation_root}/..",
            :privacy_file_aggregation_enabled => podfile_properties['apple.privacyManifestAggregationEnabled'] != 'false',
          )
        end
      `;

      /* podfileContent = podfileContent
        .concat(`\n\n# >>> Inserted by react-native-app-clip`)
        .concat(podfileInsert)
        .concat(`\n\n# <<< Inserted by react-native-app-clip`); */

      podfileContent = mergeContents({
        tag: "react-native-app-clip-2",
        src: podfileContent,
        newSrc: appClipTarget,
        anchor: "Pod::UI.warn e",
        offset: 3,
        comment: "#",
      }).contents;

      fs.writeFileSync(podFilePath, podfileContent);

      return config;
    },
  ]);
};
