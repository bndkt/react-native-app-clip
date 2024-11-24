import { IsClipFn } from "./types";

/**
 * If this file is bundled in, that means that the `.clip` extension is configured and the current build target is an app clip.
 *
 * This is more reliable than using the bundle identifier.
 */
const isClip: IsClipFn = () => {
	return true;
};
export default isClip;
