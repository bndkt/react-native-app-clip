import ReactNativeAppClipModule from "./ReactNativeAppClipModule";
import { ReactNativeAppClipModuleType } from "./ReactNativeAppClipModule/types";
import getBundleIdentifier from "./getBundleIdentifier";
import isClip from "./isClip";

export const getContainerURL: ReactNativeAppClipModuleType["getContainerURL"] = (
	groupIdentifier,
) => {
	return ReactNativeAppClipModule.getContainerURL(groupIdentifier);
};

export const displayOverlay: ReactNativeAppClipModuleType["displayOverlay"] = () => {
	return ReactNativeAppClipModule.displayOverlay();
};

export const setSharedCredential: ReactNativeAppClipModuleType["setSharedCredential"] = (
	groupIdentifier,
	credential,
) => {
	return ReactNativeAppClipModule.setSharedCredential(groupIdentifier, credential);
};

export const getSharedCredential: ReactNativeAppClipModuleType["getSharedCredential"] = (
	groupIdentifier,
) => {
	return ReactNativeAppClipModule.getSharedCredential(groupIdentifier);
};

export { getBundleIdentifier, isClip };
