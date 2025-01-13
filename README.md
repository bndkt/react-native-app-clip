# react-native-app-clip

> **Warning**
> Starting with version 0.4.0, react-native-app-clip requires **Expo SDK 52** and **React Native 0.76**. Downgrade to 0.3.1 if you wish to use **Expo SDK 51** and **React Native 0.74**.

Expo Config Plugin that generates an App Clip for iOS apps built with Expo.

## Installation

Install it in your project:

```sh
npx expo install react-native-app-clip
```

In your app’s Expo config (app.json, or app.config.js), make sure that react-native-app-clip has been added to the list of plugins. You may optionally provide a name option, which will determine the display name of your App Clip in iOS. If you do not provide a value here, it will be your app’s name appended with " Clip".

```app.json
"expo": {
  "name": "my-app",
  "plugins": [
      ["react-native-app-clip", { "name": "My App Clip" }]
  ]
}
```

You can add more parameters to the plugin configuration as specified in the [Additional parameters](#additional-parameters) section below.

Generate the native code:
```sh
npx expo prebuild
```

Run the App Clip scheme (Release mode tends to be more reliable):

```sh
npx expo run:ios --configuration Release --scheme
```

After installing the App Clip scheme, you can launch the App Clip:

```sh
xcrun simctl launch <DEVICE-UUID> <APP_CLIP_BUNDLE_ID>
```

NOTE: You can find the simulator device UUID by running `xcrun simctl list`. The App Clip Bundle Identifier is the `bundleIdentifier` followed by the `bundleIdSuffix` (see [Additional parameters - bundleIdSuffix](additional-parameters) for more details) joined by a `.`.

## Additional parameters:

-   **name** (string): The public name of the App Clip (displayed when opening it).
-   **enabled** (boolean, default: true): Whether the App Clip should be built.
-   **bundleIdSuffix** (string, default: "Clip"): The suffix that is appended to the bundle id to form the App Clip's bundle id. Please note: If you change this, you need to pass the new suffix when using the isClip() function (e.g. `isClip("AppClip")`).
-   **targetSuffix** (string, default: "Clip"): The suffix that is appended to the target name.
-   **groupIdentifier** (string): Configures an app group to share data between App Clip and full app (see [Apple Developer Docs](https://developer.apple.com/documentation/xcode/configuring-app-groups))
-   **deploymentTarget** (string): Sets the deployment target for the App Clip. If you set this to "16.0", your App Clip can be 15 MB instead of 10 MB.
-   **requestEphemeralUserNotification** (boolean): Enables notifications for the App Clip (see [Apple Developer Docs](https://developer.apple.com/documentation/app_clips/enabling_notifications_in_app_clips))
-   **requestLocationConfirmation** (boolean): Allow App Clip access to location data (see [Apple Developer Docs](https://developer.apple.com/documentation/app_clips/confirming_the_user_s_physical_location))
-   **appleSignin** (boolean): Enable "Sign in with Apple" for the App Clip
-   **applePayMerchantIds** (string[]): Enable Apple Pay capability with provided merchant IDs.
-   **excludedPackages** (string[]): Packages to exclude from autolinking for the App Clip to reduce bundle size (see below).
-   **pushNotifications** (boolean): Enable push notification compatibility for the App Clip

## Native capabilities

```typescript
import {
	isClip,
	displayOverlay,
} from "react-native-app-clip";
```

**isClip()** allows determining whether the code is currently run within the App Clip and can be used to apply different content and behaviors for the full app and the App Clip.

**displayOverlay()** shows the native iOS banner to promote the full app within the App Clip (see [Apple Developer Docs](https://developer.apple.com/documentation/app_clips/recommending_your_app_to_app_clip_users)).

## Sharing data between App Clip and full app

Data can be shared from the App Clip to the full app by using [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/) from iOS 15.4 onwards. Data is securely shared using the keychain and can be accessed by the full app after installation (see [Apple Developer Docs](https://developer.apple.com/documentation/appclip/sharing-data-between-your-app-clip-and-your-full-app#Review-keychain-usage)).


## App Clip file extension (.clip)

You can configure an App Clip specific file extension similar to [React Native's native platform extensions](https://reactnative.dev/docs/platform-specific-code#native-specific-extensions-ie-sharing-code-with-nodejs-and-web). Enabling this can help optimize build sizes since only the `.clip` file will be included in the App Clip JS bundle. You can replace heavy assets, large components, or unsupported library features using this file extension. The `.clip` extension preference can be configured in `metro.config.js` by prepending `clip` to each of the existing source extensions when the env variable `BUILDING_FOR_APP_CLIP` is enabled.

### Usage

```typescript
if (process.env.BUILDING_FOR_APP_CLIP) {
	console.info("Building for App Clip");
	config.resolver = {
		...config.resolver,
		sourceExts: [].concat(
			config.resolver.sourceExts.map((e) => `clip.${e}`),
			config.resolver.sourceExts,
		),
	};
}
```

## Before building for release (TestFlight and App Store)

Please note that you must register a new App ID for the App Clip in your Apple Developer profile. Under "Certificates, Identifiers & Profiles", go to “Identifiers”, click on the plus icon and select "App IDs" to create a new App ID. Select "App Clip" as the type and on the next screen, select your main app as the "Parent App ID" and enter Clip as the product name (it is crucial that the product name is "Clip" and nothing else. At the bottom of the page, Apple shows a preview of the App Clip Bundle ID. If your main app’s bundle ID is com.example.my-app, the App Clip Bundle ID should now be com.example.my-app.Clip.

## How to test the App Clip

App Clips can not be tested with Expo Go or expo-dev-client. The best two ways to test the App Clip seem to be the following:

### Run in Simulator

Build the development client first by running `expo run:ios` and opening the app in Simulator. After doing this once, you can run `expo run:ios --scheme` and select the App Clip scheme ("...Clip") to open the App Clip. You could also add an extra script to your project’s package.json:

```package.json
"scripts": {
  "clip": "expo run:ios --scheme my-appClip"
}
```

Now you can simply type "npm run clip" in your terminal to open the App Clip.

### Build App Clip with Xcode and open on a connected device

Run `expo prebuild -p ios` (see https://docs.expo.dev/workflow/expo-cli/#expo-prebuild) in your Expo project folder to generate the ios folder with all native sources. Then open the file `ios/my-app.xcworkspace` (with my-app being your app’s name) in Xcode. In your project, you should find two targets, one named like your app (e.g. "my-app") and one with a "Clip" suffix (e.g. "my-appClip"). For both targets, select a team in the "Signing & Capabilities" tab and make sure a signing certificate is selected by Xcode. Then, using the menu bar, select "Product", followed by "Scheme", where you should see two themes listed at the bottom of the menu, named after the two targets. Select the scheme that ends with "Clip". Now you can build and run the App Clip (using the menu bar via "Product" followed by "Run" or using the shortcut ⌘R).

Launching from Xcode can often fix issues in which the App Clip doesn't show up as an installed app on the device. Once you launch from Xcode once, your App Clip should be available with subsequent CLI builds.

### Build for production using EAS Build and test via TestFlight

You can build your app and submit it to the App Store (see https://docs.expo.dev/build/introduction/) to test the App Clip using TestFlight. Refer to Apple’s developer docs about testing App Clips: https://developer.apple.com/documentation/app_clips/testing_the_launch_experience_of_your_app_clip.
