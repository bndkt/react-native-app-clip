import { XcodeProject } from "@expo/config-plugins";

export default function addPbxGroup(
  proj: XcodeProject,
  { appClipName }: { appClipName: string }
) {
  // Add PBX group
  const { uuid: pbxGroupUuid, pbxGroup } = proj.addPbxGroup(
    [
      "AppDelegate.h",
      "AppDelegate.mm",
      "main.m",
      "Info.plist",
      `${appClipName}.entitlements`,
    ],
    appClipName,
    appClipName
  );
  console.log(`Added PBXGroup ${pbxGroupUuid}`);

  /* let pbxGroupUuid: string | undefined = undefined;

  // Find PBXGroup
  Object.keys(groups).forEach(function (key) {
    console.log("GROUP", groups[key].name, appClipName);
    if (groups[key].name === appClipName) {
      pbxGroupUuid = key;
      console.log(`Found root PBXGroup: ${key}`);
    }
  }); */

  // Add PBXGroup to top level group
  const groups = proj.hash.project.objects["PBXGroup"];
  if (pbxGroupUuid) {
    Object.keys(groups).forEach(function (key) {
      if (groups[key].name === undefined) {
        proj.addToPbxGroup(pbxGroupUuid, key);
        console.log(
          `Added PBXGroup ${pbxGroupUuid} root PBXGroup group ${key}`
        );
      }
    });
  }
}
