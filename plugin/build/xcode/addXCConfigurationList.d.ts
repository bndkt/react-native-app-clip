import type { XcodeProject } from "expo/config-plugins";
export declare function addXCConfigurationList(xcodeProject: XcodeProject, { name, targetName, currentProjectVersion, bundleIdentifier, deploymentTarget, appleTeamId, appIconName, }: {
    name: string;
    targetName: string;
    currentProjectVersion: string;
    bundleIdentifier: string;
    deploymentTarget: string;
    appleTeamId?: string;
    appIconName?: string;
}): any;
