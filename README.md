# react-native-app-clip

Expo Config Plugin that generates an App Clip for iOS apps built with Expo.

> **Warning** This plugin is a work in progress and hasn’t been adequately tested in the wild. I made the repository public to gather feedback and ask for help. Don’t use this plugin in production just yet!

## Installation

Install it in your project:

```sh
expo install react-native-app-clip
```

In your app’s Expo config (app.json, or app.config.js), add react-native-app-clip to the list of plugins. You also need to specify the target name and bundle identifier of the App Clip, as well as the bundle identifier of the parent application (your main app). Please note that the target name needs to be the name of your app with "Clip" as the suffix and the bundle identifier has the suffix ".Clip". So if your app’s name is "my-app" with "com.example.my-app" as the bundle identifier, the App Clip’s target name needs to be "my-appClip”, and its bundle identifier will be "com.example.my-app.Clip".

```app.json
"expo": {
  "name": "my-app",
  "plugins": [
      ["react-native-app-clip", { "entryPoint": "index.appclip.js", "name": "My App Clip" }]
  ],
  "extra": {
    "eas": {
      "build": {
        "experimental": {
          "ios": {
            "appExtensions": [
              {
                "targetName": "my-appClip",
                "bundleIdentifier": "com.example.my-app.Clip",
                "entitlements": {
                  "com.apple.developer.parent-application-identifiers": "com.example.my-app",
                  "com.apple.developer.on-demand-install-capable": true
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

## Configuration

Specifying the entryPoint parameter is optional; it defaults to "index.appclip.js". This means that the App Clip expects a file called index.appclip.js in the project’s root directory. You can change this value to "index.js" to reuse the Expo app’s existing entry point, which means the App Clip experience will be the same as the full app experience. In most cases, however, it will make sense to have a separate entry point that only renders a subset of the app’s capabilities as the App Clip experience.

## Before building for the App Store

Please note that you must register a new App ID for the App Clip in your Apple Developer profile. Under "Certificates, Identifiers & Profiles", go to “Identifiers”, click on the plus icon and select "App IDs" to create a new App ID. Select "App Clip" as the type and on the next screen, select your main app as the "Parent App ID" and enter Clip as the product name (it is crucial that the product name is "Clip" and nothing else. At the bottom of the page, Apple shows a preview of the App Clip Bundle ID. If your main app’s bundle ID is com.example.my-app, the App Clip Bundle ID should now be com.example.my-app.Clip.

## How to test the App Clip

App Clips can not be tested with Expo Go or expo-dev-client. The best two ways to test the App Clip seem to be the following:

### Run in Simulator

Run `expo run:ios --scheme` and select the App Clip scheme ("...Clip") to open the App Clip in Simulator. You could also add an extra script to your project's package.json:

```package.json
"scripts": {
  "clip": "expo run:ios --scheme my-appClip"
}
```

Now you can simply type "npm run clip" in your terminal to open the App Clip in Simulator.

### Build App Clip with Xcode and open on a connected device

Run `expo prebuild -p ios` (see https://docs.expo.dev/workflow/expo-cli/#expo-prebuild) in your Expo project folder to generate the ios folder with all native sources. Then open the file `ios/my-app.xcworkspace` (with my-app being your app’s name) in Xcode. In your project, you should find two targets, one named like your app (e.g. "my-app") and one with a "Clip" suffix (e.g. "my-appClip"). For both targets, select a team in the "Signing & Capabilities" tab and make sure a signing certificate is selected by Xcode. Then, using the menu bar, select "Product", followed by "Scheme", where you should see two themes listed at the bottom of the menu, named after the two targets. Select the scheme that ends with "Clip". Now you can build and run the App Clip (using the menu bar via "Product" followed by "Run" or using the shortcut ⌘R).

### Build for production using EAS Build and test via TestFlight

You can build your app and submit it to the App Store (see https://docs.expo.dev/build/introduction/) to test the App Clip using TestFlight. Refer to Apple’s developer docs about testing App Clips: https://developer.apple.com/documentation/app_clips/testing_the_launch_experience_of_your_app_clip.
