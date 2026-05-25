import ReactNativeAppClipModule from "../ReactNativeAppClipModule";
import type { GetBundleIdentiferFn } from "./types";

let bundleIdentifier: string | null = null;
const getBundleIdentifier: GetBundleIdentiferFn = () => {
	// Bundle identifier doesn't change during runtime
	if (bundleIdentifier) return bundleIdentifier;
	bundleIdentifier = ReactNativeAppClipModule.getBundleIdentifier();
	return bundleIdentifier;
};
export default getBundleIdentifier;
