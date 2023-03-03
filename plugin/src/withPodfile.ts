import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

export const withPodfile: ConfigPlugin<{
  targetName: string;
  excludedPackages?: string[];
}> = (config, { targetName, excludedPackages }) => {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfileContent = fs.readFileSync(podFilePath).toString();

      const nativeModulesPath = require.resolve(
        "@react-native-community/cli-platform-ios/native_modules.rb"
      );

      let nativeModulesContent = fs.readFileSync(nativeModulesPath).toString();
      nativeModulesContent = nativeModulesContent.replace(
        "use_native_modules",
        "use_native_modules_app_clip"
      );
      /* nativeModulesContent = `\n\n# >>> inserted by react-native-app-clip\n\n`
        .concat(nativeModulesContent)
        .concat(`\n\n# <<< inserted by react-native-app-clip`); */

      if (excludedPackages && excludedPackages.length > 0) {
        nativeModulesContent = nativeModulesContent.replace(
          `["node", cli_bin, "config"]`,
          `["node", cli_bin, "app-clip", "--exclude", "${excludedPackages.join(
            ","
          )}"]`
        );
      }

      podfileContent = mergeContents({
        tag: "react-native-app-clip-1",
        src: podfileContent,
        newSrc: nativeModulesContent,
        anchor: `@react-native-community/cli-platform-ios/package.json`,
        offset: 1,
        comment: "#",
      }).contents;

      const useExpoModules =
        excludedPackages && excludedPackages.length > 0
          ? `exclude = ["${excludedPackages.join(`", "`)}"]
      use_expo_modules!(exclude: exclude)`
          : `use_expo_modules!`;

      const appClipTarget = `
        target '${targetName}' do
          inherit! :none
          ${useExpoModules}
          config = use_native_modules_app_clip!
          
          use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
          use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']
          
          # Flags change depending on the env values.
          flags = get_default_flags()
          
          use_react_native!(
            :path => config[:reactNativePath],
            :hermes_enabled => podfile_properties['expo.jsEngine'] == nil || podfile_properties['expo.jsEngine'] == 'hermes',
            :fabric_enabled => flags[:fabric_enabled],
            # An absolute path to your application root.
            :app_path => "#{Pod::Config.instance.installation_root}/..",
            # Note that if you have use_frameworks! enabled, Flipper will not work if enabled
            :flipper_configuration => flipper_config
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
        anchor: `post_install do`,
        offset: -1,
        comment: "#",
      }).contents;

      fs.writeFileSync(podFilePath, podfileContent);

      return config;
    },
  ]);
};
