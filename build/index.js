import ReactNativeAppClipModule from "./ReactNativeAppClipModule";
export function isClip() {
    const bundleIdentifier = ReactNativeAppClipModule.getBundleIdentifier();
    const isClip = bundleIdentifier?.slice(bundleIdentifier.lastIndexOf(".") + 1) === "Clip";
    return isClip;
}
export function getContainerURL(groupIdentifier) {
    return ReactNativeAppClipModule.getContainerURL(groupIdentifier);
}
export function getBundleIdentifier() {
    return ReactNativeAppClipModule.getBundleIdentifier();
}
export function displayOverlay() {
    return ReactNativeAppClipModule.displayOverlay();
}
export function setSharedCredential(groupIdentifier, credential) {
    return ReactNativeAppClipModule.setSharedCredential(groupIdentifier, credential);
}
export function getSharedCredential(groupIdentifier) {
    return ReactNativeAppClipModule.getSharedCredential(groupIdentifier);
}
//# sourceMappingURL=index.js.map