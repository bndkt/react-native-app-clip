"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductFile = void 0;
function addProductFile(xcodeProject, { targetName, groupName }) {
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
exports.addProductFile = addProductFile;
