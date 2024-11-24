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
          ? `exclude = ["${excludedPackages.join(`", "`)}"]\n  use_expo_modules!(exclude: exclude)`
          : "use_expo_modules!";

      const appClipTarget = `
target '${targetName}' do
  ${useExpoModules}

  if ENV['EXPO_USE_COMMUNITY_AUTOLINKING'] == '1'
    config_command = ['node', '-e', "process.argv=['', '', 'config'];require('@react-native-community/cli').run()"];
  else
    config_command = [
      'node',
      '--no-warnings',
      '--eval',
      'require(require.resolve(\\'expo-modules-autolinking\\', { paths: [require.resolve(\\'expo/package.json\\')] }))(process.argv.slice(1))',
      'react-native-config',
      '--json',
      '--platform',
      'ios'
    ]
  end

  # Running the command in the same manner as \`use_react_native\` then running that result through our cliPlugin
  json, _, status = Pod::Executable.capture_command(config_command[0], config_command[1..], capture: :both)
  if not status.success?
    Pod::UI.warn "The command: '#{config_command.join(" ").bold.yellow}' returned a status code of #{status.exitstatus.to_s.bold.red}", [
        "App Clip autolinking failed. Please ensure autolinking works correctly for the main app target and try again.",
    ]
    exit(status.exitstatus)
  end
  # \`react-native-app-clip\` resolves to react-native-app-clip/build/index.js
  clip_command = [
    'node',
    '--no-warnings',
    '--eval',
    'require(require.resolve(\\'react-native-app-clip\\')+\\'/../../plugin/build/cliPlugin.js\\').run(' + json + ', [${(excludedPackages ?? []).map((packageName) => `"${packageName}"`).join(", ")}])'
  ]

  config = use_native_modules!(clip_command)

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

      // It's generally safer to use `mergeContents` to insert new content into the Podfile, but this new target should always be inserted at the end of the file.
      podfileContent = podfileContent
        .concat(`\n\n# >>> Inserted by react-native-app-clip\n`)
        .concat(appClipTarget)
        .concat(`\n\n# <<< Inserted by react-native-app-clip\n`);

      fs.writeFileSync(podFilePath, podfileContent);

      return config;
    },
  ]);
};
