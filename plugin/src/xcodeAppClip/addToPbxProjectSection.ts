import { XcodeProject } from "@expo/config-plugins";

export default function addToPbxProjectSection(
  proj: XcodeProject,
  target: any
) {
  proj.addToPbxProjectSection(target);

  // Add target attributes to project section
  if (
    !proj.pbxProjectSection()[proj.getFirstProject().uuid].attributes
      .TargetAttributes
  ) {
    proj.pbxProjectSection()[
      proj.getFirstProject().uuid
    ].attributes.TargetAttributes = {};
  }
  proj.pbxProjectSection()[
    proj.getFirstProject().uuid
  ].attributes.TargetAttributes[target.uuid] = {
    LastSwiftMigration: 1250,
  };
}
