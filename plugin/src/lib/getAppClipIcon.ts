import type { ConfigPlugin } from "expo/config-plugins";
import path from "node:path";

export function getAppClipIcon(
  config: Pick<Parameters<ConfigPlugin>[0], "icon" | "ios">,
): { name: string; fileName: string } | undefined {
  let icon = config.ios?.icon || config.icon;
  if (icon && typeof icon === "object" && !icon.light && !icon.dark && !icon.tinted) {
    icon = config.icon;
  }
  if (typeof icon !== "string" || path.extname(icon) !== ".icon") {
    return undefined;
  }
  return {
    name: path.basename(icon, ".icon"),
    fileName: path.basename(icon),
  };
}
