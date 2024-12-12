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

/**
 * @deprecated Use [`setItem`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestoresetitemkey-value-options) from `expo-secure-store` instead. From iOS 15.4 and onwards, App Clip keychain data is shared with the containing app.
 */
export const setSharedCredential: ReactNativeAppClipModuleType["setSharedCredential"] = (
	groupIdentifier,
	credential,
) => {
	return ReactNativeAppClipModule.setSharedCredential(groupIdentifier, credential);
};

/**
 * @deprecated Use [`getItem`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestoregetitemkey-options) from `expo-secure-store` instead. From iOS 15.4 and onwards, App Clip keychain data is shared with the containing app.
 */
export const getSharedCredential: ReactNativeAppClipModuleType["getSharedCredential"] = (
	groupIdentifier,
) => {
	return ReactNativeAppClipModule.getSharedCredential(groupIdentifier);
};

export { getBundleIdentifier, isClip };
