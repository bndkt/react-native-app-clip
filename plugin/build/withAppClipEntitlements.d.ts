import { ConfigPlugin } from "@expo/config-plugins";
export declare const withAppClipEntitlements: ConfigPlugin<{
    targetName: string;
    targetPath: string;
    groupIdentifier: string;
    appleSignin: boolean;
}>;
