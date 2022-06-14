import { ConfigPlugin } from "@expo/config-plugins";

type WithIosAppClipConfigPluginProps = { name?: string };

const withIosAppClip: ConfigPlugin<WithIosAppClipConfigPluginProps> = (
  config,
  { name = "my-app" } = {}
) => {
  config.name = name;
  return config;
};

export default withIosAppClip;
