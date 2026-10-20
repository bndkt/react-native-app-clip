import { type ConfigPlugin } from "expo/config-plugins";
export declare const withEntitlements: ConfigPlugin<{
    targetName: string;
    groupIdentifier: string;
    appleSignin: boolean;
    applePayMerchantIds: string[];
    pushNotifications: boolean;
}>;
