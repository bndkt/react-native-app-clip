import * as util from "util";

export type PBXFile = any;

export function quoted(str: string) {
  return util.format(`"%s"`, str);
}

// Copied helper functions from cordova-node-xcode

export function longComment(file: PBXFile) {
  return util.format("%s in %s", file.basename, file.group);
}
