import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

export type ReactNativeAppClipModule = {
  getBundleIdentifier(): string;
  getContainerURL(groupIdentifier: string): string;
  getBundleIdentifier(): string;
  displayOverlay(): void;
  setSharedCredential(groupIdentifier: string, credential: string): void;
  getSharedCredential(groupIdentifier: string): string;
}

const isIos = Platform.OS === 'ios';

const getNativeModule = () => {
  if(isIos){
    try{
      return requireNativeModule("ReactNativeAppClip") as ReactNativeAppClipModule;
    }catch{
      return undefined;
    }
  }
  return undefined;
}

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const appClipModule = getNativeModule();

export default appClipModule
