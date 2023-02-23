import ReactNativeAppClipModule from "./ReactNativeAppClipModule";

export function isClip(): boolean {
  const bundleIdentifier = ReactNativeAppClipModule.getBundleIdentifier() as
    | string
    | undefined;
  const isClip =
    bundleIdentifier?.slice(bundleIdentifier.lastIndexOf(".") + 1) === "Clip";
  return isClip;
}

export function getContainerURL(groupIdentifier: string): string {
  return ReactNativeAppClipModule.getContainerURL(groupIdentifier);
}

export function getBundleIdentifier(): string {
  return ReactNativeAppClipModule.getBundleIdentifier();
}

export function displayOverlay(): void {
  return ReactNativeAppClipModule.displayOverlay();
}

export function setSharedCredential(
  groupIdentifier: string,
  credential: string
): void {
  return ReactNativeAppClipModule.setSharedCredential(
    groupIdentifier,
    credential
  );
}

export function getSharedCredential(groupIdentifier: string): string {
  return ReactNativeAppClipModule.getSharedCredential(groupIdentifier);
}
