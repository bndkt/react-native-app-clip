import { XcodeProject } from "expo/config-plugins";

export default function addProductFile(
  proj: XcodeProject,
  appClipFolder: string,
  targetUuid: string,
  groupName: string
) {
  const productFile = {
    basename: `${appClipFolder}.app`,
    fileRef: proj.generateUuid(),
    uuid: proj.generateUuid(),
    group: groupName,
    explicitFileType: "wrapper.application",
    /* fileEncoding: 4, */
    settings: {
      ATTRIBUTES: ["RemoveHeadersOnCopy"],
    },
    includeInIndex: 0,
    path: `${appClipFolder}.app`,
    sourceTree: "BUILT_PRODUCTS_DIR",
  };

  proj.addToPbxFileReferenceSection(productFile);

  proj.addToPbxBuildFileSection(productFile);

  return productFile;
}
