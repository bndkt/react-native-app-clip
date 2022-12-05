import { XcodeProject } from "@expo/config-plugins";

export default function addTargetDependency(proj: XcodeProject, target: any) {
  if (!proj.hash.project.objects["PBXTargetDependency"]) {
    proj.hash.project.objects["PBXTargetDependency"] = {};
  }
  if (!proj.hash.project.objects["PBXContainerItemProxy"]) {
    proj.hash.project.objects["PBXContainerItemProxy"] = {};
  }

  proj.addTargetDependency(proj.getFirstTarget().uuid, [target.uuid]);
}
