import type { ExportedConfigWithProps, InfoPlist } from "expo/config-plugins";
export declare function getAppClipEntitlements(iosConfig: ExportedConfigWithProps["ios"], { groupIdentifier, appleSignin, applePayMerchantIds, pushNotifications, }: {
    groupIdentifier?: string;
    appleSignin: boolean;
    applePayMerchantIds?: string[];
    pushNotifications: boolean;
}): InfoPlist;
export declare function addApplicationGroupsEntitlement(entitlements: InfoPlist, groupIdentifier?: string): InfoPlist;
