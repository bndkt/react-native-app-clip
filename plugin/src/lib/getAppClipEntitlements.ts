import { ExportedConfig, InfoPlist } from "@expo/config-plugins";

export function getAppClipEntitlements(
  iosConfig: ExportedConfig["ios"],
  {
    groupIdentifier,
    appleSignin,
    applePayMerchantIds,
  }: {
    groupIdentifier?: string;
    appleSignin: boolean;
    applePayMerchantIds?: string[];
  }
) {
  const appBundleIdentifier = iosConfig?.bundleIdentifier;

  const entitlements: InfoPlist = {
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

  applePayMerchantIds &&
    (entitlements["com.apple.developer.in-app-payments"] = applePayMerchantIds);

  return entitlements;
}

export function addApplicationGroupsEntitlement(
  entitlements: InfoPlist,
  groupIdentifier?: string
) {
  if (groupIdentifier) {
    const existingApplicationGroups =
      (entitlements["com.apple.security.application-groups"] as string[]) ?? [];

    entitlements["com.apple.security.application-groups"] = [
      groupIdentifier,
      ...existingApplicationGroups,
    ];
  }

  return entitlements;
}
