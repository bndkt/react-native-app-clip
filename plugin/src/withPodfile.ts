import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { type ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

/**
 * `use_native_modules` is mocked out for `use_native_modules_app_clip` which includes an exclusion of excludedPackages
 * 
 * WARNING: This is very likely to break in a future version of React Native. `use_native_modules` is being moved to the `react-native` package.
 */
const getUseNativeModulesAppClip = (excludedPackages: string[] | undefined) => {
  const nativeModulesPath = require.resolve(
    "@react-native-community/cli-platform-ios/native_modules.rb"
  );

  let nativeModulesContent = fs.readFileSync(nativeModulesPath).toString();
  nativeModulesContent = nativeModulesContent.replace(
    "use_native_modules",
    "use_native_modules_app_clip"
  );

  if (excludedPackages && excludedPackages.length > 0) {
    const srcCommands = [`["node", cli_bin, "config"]`, `["node", cli_bin, "config", '--platform', 'ios']`];
    // Uses `cliPlugin.ts` to filter package.json
    const newSrcCommand = `["node", cli_bin, "app-clip", "--exclude", "${excludedPackages.join(
      ","
    )}"]`;
    const validSrcCommand = srcCommands.find((srcCommand) => nativeModulesContent.includes(srcCommand));
    if(!validSrcCommand) {
        throw new Error(`Failed to find the command to replace in the native modules file.`);
    }
    nativeModulesContent = nativeModulesContent.replace(
      validSrcCommand,
      newSrcCommand
    );
  }

  return nativeModulesContent;
}

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

      podfileContent = mergeContents({
        tag: "react-native-app-clip:def-use_native_modules_app_clip",
        src: podfileContent,
        newSrc: getUseNativeModulesAppClip(excludedPackages),
        // Top of file
        anchor: `prepare_react_native_project!`,
        offset: 1,
        comment: "#",
      }).contents;

      const useExpoModules =
        excludedPackages && excludedPackages.length > 0
          ? `exclude = ["${excludedPackages.join(`", "`)}"]
      use_expo_modules!(exclude: exclude)`
          : "use_expo_modules!";

      const appClipTarget = `
target '${targetName}' do
  ${useExpoModules}
  config = use_native_modules_app_clip!

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
      `.trim();


      podfileContent = mergeContents({
        tag: "react-native-app-clip:target",
        src: podfileContent,
        newSrc: appClipTarget,
        anchor: "Pod::UI.warn e",
        offset: 4,
        comment: "#",
      }).contents;

      fs.writeFileSync(podFilePath, podfileContent);

      return config;
    },
  ]);
};
