import type { ConfigPlugin } from "expo/config-plugins";
export declare function getAppClipIcon(config: Pick<Parameters<ConfigPlugin>[0], "icon" | "ios">): {
    name: string;
    fileName: string;
} | undefined;
