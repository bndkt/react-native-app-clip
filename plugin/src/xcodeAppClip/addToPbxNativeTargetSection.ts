import { XcodeProject } from "@expo/config-plugins";

import { PBXFile, quoted } from "./util";

export default function addToPbxNativeTargetSection(
  proj: XcodeProject,
  {
    appClipFolder,
    targetUuid,
    productFile,
    xCConfigurationList,
  }: {
    appClipFolder: string;
    targetUuid: string;
    productFile: PBXFile;
    xCConfigurationList: any;
  }
) {
  const target = {
    uuid: targetUuid,
    pbxNativeTarget: {
      isa: "PBXNativeTarget",
      name: appClipFolder,
      productName: appClipFolder,
      productReference: productFile.fileRef,
      productType: quoted(
        "com.apple.product-type.application.on-demand-install-capable"
      ),
      buildConfigurationList: xCConfigurationList.uuid,
      buildPhases: [],
      buildRules: [],
      dependencies: [],
    },
  };

  proj.addToPbxNativeTargetSection(target);

  return target;
}
