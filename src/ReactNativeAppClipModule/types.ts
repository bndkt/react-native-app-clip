import { GetBundleIdentiferFn } from "../getBundleIdentifier/types";

export interface ReactNativeAppClipModuleType {
	getContainerURL: (groupIdentifier: string) => string | null;
	getBundleIdentifier: GetBundleIdentiferFn;
	displayOverlay: () => void;
	setSharedCredential: (groupIdentifier: string, credential: string) => void;
	getSharedCredential: (groupIdentifier: string) => string | null;
}
