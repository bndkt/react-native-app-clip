import getBundleIdentifier from "../getBundleIdentifier";
import type { IsClipFn } from "./types";

const isClip: IsClipFn = (bundleIdSuffix = "Clip") => {
	const bundleIdentifier = getBundleIdentifier();
	const isClip =
		bundleIdentifier?.slice(bundleIdentifier.lastIndexOf(".") + 1) ===
		bundleIdSuffix;
	return isClip;
};
export default isClip;
