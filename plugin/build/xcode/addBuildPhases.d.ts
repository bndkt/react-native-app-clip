import type { XcodeProject } from "expo/config-plugins";
export declare function addBuildPhases(xcodeProject: XcodeProject, { targetUuid, groupName, productFile, enableCompression, resourcesPhaseName, }: {
    targetUuid: string;
    groupName: string;
    productFile: {
        uuid: string;
        target: string;
        basename: string;
        group: string;
    };
    enableCompression?: boolean;
    resourcesPhaseName?: string;
}): void;
