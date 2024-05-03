"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addApplicationGroupsEntitlement = exports.getAppClipEntitlements = void 0;
function getAppClipEntitlements(iosConfig, { groupIdentifier, appleSignin, }) {
    const appBundleIdentifier = iosConfig?.bundleIdentifier;
    const entitlements = {
        "com.apple.developer.parent-application-identifiers": [
            `$(AppIdentifierPrefix)${appBundleIdentifier}`,
        ],
        "com.apple.developer.on-demand-install-capable": true,
    };
    addApplicationGroupsEntitlement(entitlements, groupIdentifier);
    appleSignin &&
        (entitlements["com.apple.developer.applesignin"] = ["Default"]);
    iosConfig?.associatedDomains &&
        (entitlements["com.apple.developer.associated-domains"] =
            iosConfig.associatedDomains);
    return entitlements;
}
exports.getAppClipEntitlements = getAppClipEntitlements;
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
exports.addApplicationGroupsEntitlement = addApplicationGroupsEntitlement;
