import { XcodeProject } from "@expo/config-plugins";

export default function addProductFile(
  proj: XcodeProject,
  appClipName: string,
  targetUuid: string,
  groupName: string
) {
  // const productFileUuid = proj.generateUuid();
  /* const productFile = proj.addProductFile(appClipName, {
    target: targetUuid,
    group: groupName,
    explicitFileType: "wrapper.application",
    defaultEncoding: 4,
  });
  productFile.settings = productFile.settings || {};
  productFile.settings.ATTRIBUTES = ["RemoveHeadersOnCopy"];
  */
  const productFile = {
    basename: `${appClipName}.app`,
    fileRef: proj.generateUuid(),
    uuid: proj.generateUuid(),
    group: groupName,
    explicitFileType: "wrapper.application",
    /* fileEncoding: 4, */
    settings: {
      ATTRIBUTES: ["RemoveHeadersOnCopy"],
    },
    includeInIndex: 0,
    path: `${appClipName}.app`,
    sourceTree: "BUILT_PRODUCTS_DIR",
  };

  proj.addToPbxFileReferenceSection(productFile);
  console.log(`Added PBXFileReference: ${productFile.fileRef}`);

  proj.addToPbxBuildFileSection(productFile);
  console.log(`Added PBXBuildFile: ${productFile.fileRef}`);

  return productFile;
}
