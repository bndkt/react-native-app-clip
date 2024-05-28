import { XcodeProject } from "@expo/config-plugins";
export declare function addBuildPhases(xcodeProject: XcodeProject, { targetName, targetUuid, groupName, productFile, }: {
    targetName: string;
    targetUuid: string;
    groupName: string;
    productFile: {
        uuid: string;
        target: string;
        basename: string;
        group: string;
    };
}): void;
