import { type ConfigPlugin } from "expo/config-plugins";
declare const withAppClip: ConfigPlugin<{
    name?: string;
    enabled?: boolean;
    bundleIdSuffix?: string;
    targetSuffix?: string;
    groupIdentifier?: string;
    deploymentTarget?: string;
    requestEphemeralUserNotification?: boolean;
    requestLocationConfirmation?: boolean;
    appleSignin?: boolean;
    applePayMerchantIds?: string[];
    excludedPackages?: string[];
    pushNotifications?: boolean;
    enableCompression?: boolean;
}>;
export default withAppClip;
