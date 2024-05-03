"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToPbxNativeTargetSection = void 0;
function addToPbxNativeTargetSection(xcodeProject, { targetName, targetUuid, productFile, xCConfigurationList, }) {
    const target = {
        uuid: targetUuid,
        pbxNativeTarget: {
            isa: "PBXNativeTarget",
            name: targetName,
            productName: targetName,
            productReference: productFile.fileRef,
            productType: `"com.apple.product-type.application.on-demand-install-capable"`,
            buildConfigurationList: xCConfigurationList.uuid,
            buildPhases: [],
            buildRules: [],
            dependencies: [],
        },
    };
    xcodeProject.addToPbxNativeTargetSection(target);
    return target;
}
exports.addToPbxNativeTargetSection = addToPbxNativeTargetSection;
