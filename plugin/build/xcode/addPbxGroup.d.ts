import type { XcodeProject } from "expo/config-plugins";
export declare function addPbxGroup(xcodeProject: XcodeProject, { projectName, targetName, platformProjectRoot, appIconFileName, }: {
    projectName: string;
    targetName: string;
    platformProjectRoot: string;
    appIconFileName?: string;
}): void;
