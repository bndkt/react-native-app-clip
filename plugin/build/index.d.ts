import { ConfigPlugin } from "@expo/config-plugins";
declare const withAppClip: ConfigPlugin<{
    name: string;
    groupIdentifier?: string;
    deploymentTarget?: string;
    requestEphemeralUserNotification?: boolean;
    requestLocationConfirmation?: boolean;
    appleSignin?: boolean;
    excludedPackages: string[];
}>;
export default withAppClip;
