import { XcodeProject } from "@expo/config-plugins";

export default function addToPbxProjectSection(
  proj: XcodeProject,
  target: any
) {
  proj.addToPbxProjectSection(target);

  console.log(`Added target to pbx project section ${target.uuid}`);

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
    CreatedOnToolsVersion: "13.4.1",
  };
}
