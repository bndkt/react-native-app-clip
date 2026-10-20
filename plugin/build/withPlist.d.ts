import { type ConfigPlugin } from "expo/config-plugins";
export declare const withPlist: ConfigPlugin<{
    targetName: string;
    deploymentTarget: string;
    requestEphemeralUserNotification: boolean;
    requestLocationConfirmation: boolean;
}>;
