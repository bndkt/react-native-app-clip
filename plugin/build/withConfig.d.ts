import type { ConfigPlugin } from "expo/config-plugins";
export declare const withConfig: ConfigPlugin<{
    targetName: string;
    bundleIdentifier: string;
    appleSignin: boolean;
    applePayMerchantIds: string[];
    pushNotifications: boolean;
}>;
