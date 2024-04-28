import { ExportedConfig, InfoPlist } from "@expo/config-plugins";
export declare function getAppClipEntitlements(iosConfig: ExportedConfig["ios"], { groupIdentifier, appleSignin, }: {
    groupIdentifier?: string;
    appleSignin: boolean;
}): InfoPlist;
export declare function addApplicationGroupsEntitlement(entitlements: InfoPlist, groupIdentifier?: string): InfoPlist;
