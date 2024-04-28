import { ConfigPlugin } from "@expo/config-plugins";
export declare const withXcode: ConfigPlugin<{
    name: string;
    targetName: string;
    bundleIdentifier: string;
    deploymentTarget: string;
}>;
