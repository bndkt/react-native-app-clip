import { ConfigPlugin } from "@expo/config-plugins";
export declare const withAppClipPlist: ConfigPlugin<{
    targetName: string;
    deploymentTarget: string;
    requestEphemeralUserNotification?: boolean;
    requestLocationConfirmation?: boolean;
}>;
