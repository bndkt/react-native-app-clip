"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppClipEntitlements = getAppClipEntitlements;
exports.addApplicationGroupsEntitlement = addApplicationGroupsEntitlement;
function getAppClipEntitlements(iosConfig, { groupIdentifier, appleSignin, applePayMerchantIds, pushNotifications, }) {
    const appBundleIdentifier = iosConfig?.bundleIdentifier;
    const entitlements = {
        "com.apple.developer.parent-application-identifiers": [
            `$(AppIdentifierPrefix)${appBundleIdentifier}`,
        ],
        "com.apple.developer.on-demand-install-capable": true,
    };
    addApplicationGroupsEntitlement(entitlements, groupIdentifier);
    if (appleSignin) {
        entitlements["com.apple.developer.applesignin"] = ["Default"];
    }
    if (applePayMerchantIds) {
        entitlements["com.apple.developer.in-app-payments"] = applePayMerchantIds;
    }
    if (pushNotifications) {
        // XCode automatically changes this to "production" when archiving https://stackoverflow.com/a/42293632/4047926
        entitlements["aps-environment"] = "development";
    }
    if (iosConfig?.associatedDomains) {
        entitlements["com.apple.developer.associated-domains"] =
            iosConfig.associatedDomains;
    }
    return entitlements;
}
function addApplicationGroupsEntitlement(entitlements, groupIdentifier) {
    if (groupIdentifier) {
        const existingApplicationGroups = entitlements["com.apple.security.application-groups"] ?? [];
        entitlements["com.apple.security.application-groups"] = [
            groupIdentifier,
            ...existingApplicationGroups,
        ];
    }
    return entitlements;
}
