import { ReactNativeAppClipModuleType } from "./types";

const ReactNativeAppClipModule: ReactNativeAppClipModuleType = {
	getContainerURL: (groupIdentifier: string) => {
		return null;
	},
	getBundleIdentifier: () => {
		return null;
	},
	displayOverlay: () => {},
	setSharedCredential: () => {},
	getSharedCredential: () => {
		return null;
	},
};
export default ReactNativeAppClipModule;
