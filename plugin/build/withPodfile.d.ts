import { type ConfigPlugin } from "expo/config-plugins";
export declare const withPodfile: ConfigPlugin<{
    targetName: string;
    excludedPackages?: string[];
}>;
