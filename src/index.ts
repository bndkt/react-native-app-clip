import ReactNativeAppClipModule from "./ReactNativeAppClipModule";

export function isClip(bundleIdSuffix = "Clip"): boolean {
  const bundleIdentifier = ReactNativeAppClipModule.getBundleIdentifier() as
    | string
    | undefined;
  const isClip =
    bundleIdentifier?.slice(bundleIdentifier.lastIndexOf(".") + 1) ===
    bundleIdSuffix;

  return isClip;
}

export function getContainerURL(groupIdentifier: string): string {
  return ReactNativeAppClipModule.getContainerURL(groupIdentifier);
}

export function getBundleIdentifier(): string {
  return ReactNativeAppClipModule.getBundleIdentifier();
}

export function displayOverlay(): void {
  ReactNativeAppClipModule.displayOverlay();
}

export function setSharedCredential(
  groupIdentifier: string,
  credential: string
): void {
  ReactNativeAppClipModule.setSharedCredential(groupIdentifier, credential);
}

export function getSharedCredential(groupIdentifier: string): string {
  return ReactNativeAppClipModule.getSharedCredential(groupIdentifier);
}
