import { XcodeProject } from "@expo/config-plugins";
export declare function addBuildPhases(xcodeProject: XcodeProject, { targetUuid, groupName, productFile, }: {
    targetUuid: string;
    groupName: string;
    productFile: {
        uuid: string;
        target: string;
        basename: string;
        group: string;
    };
}): void;
