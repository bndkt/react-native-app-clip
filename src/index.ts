import getBundleIdentifier from "./getBundleIdentifier";
import isClip from "./isClip";
import ReactNativeAppClipModuleIos from "./ReactNativeAppClipModule/ReactNativeAppClipModule.ios";
import { ReactNativeAppClipModuleType } from "./ReactNativeAppClipModule/types";

export const getContainerURL: ReactNativeAppClipModuleType["getContainerURL"] =
	(groupIdentifier) => {
		return ReactNativeAppClipModuleIos.getContainerURL(groupIdentifier);
	};

export const displayOverlay: ReactNativeAppClipModuleType["displayOverlay"] =
	() => {
		return ReactNativeAppClipModuleIos.displayOverlay();
	};

export const setSharedCredential: ReactNativeAppClipModuleType["setSharedCredential"] =
	(groupIdentifier, credential) => {
		return ReactNativeAppClipModuleIos.setSharedCredential(
			groupIdentifier,
			credential,
		);
	};

export const getSharedCredential: ReactNativeAppClipModuleType["getSharedCredential"] =
	(groupIdentifier) => {
		return ReactNativeAppClipModuleIos.getSharedCredential(groupIdentifier);
	};

export { getBundleIdentifier, isClip };
