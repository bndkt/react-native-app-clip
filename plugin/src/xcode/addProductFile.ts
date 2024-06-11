import type { XcodeProject } from "@expo/config-plugins";

export function addProductFile(
  xcodeProject: XcodeProject,
  { targetName, groupName }: { targetName: string; groupName: string },
) {
  const options = {
    basename: `${targetName}.app`,
    // fileRef: xcodeProject.generateUuid(),
    // uuid: xcodeProject.generateUuid(),
    group: groupName,
    explicitFileType: "wrapper.application",
    /* fileEncoding: 4, */
    settings: {
      ATTRIBUTES: ["RemoveHeadersOnCopy"],
    },
    includeInIndex: 0,
    path: `${targetName}.app`,
    sourceTree: "BUILT_PRODUCTS_DIR",
  };

  const productFile = xcodeProject.addProductFile(targetName, options);

  return productFile;
}
