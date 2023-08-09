import ExpoModulesCore
import StoreKit

internal class MissingCurrentWindowSceneException: Exception {
    override var reason: String {
        "Cannot determine the current window scene in which to present the modal for requesting a review."
    }
}

internal class MissingContainerURLException: Exception {
    override var reason: String {
        "Cannot determine the container URL."
    }
}

public class ReactNativeAppClipModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ReactNativeAppClip')` in JavaScript.
        Name("ReactNativeAppClip")
        
        // Get containerURL to share data between App Clip and app
        // https://developer.apple.com/documentation/app_clips/sharing_data_between_your_app_clip_and_your_full_app
        Function("getContainerURL") { (groupIdentifier: String) -> String in
            let logger = Logger()
            logger.info("getContainerURL() called with groupIdentifier \(groupIdentifier)")
            
            let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: groupIdentifier)
            
            if let unwrapped = containerURL {
                logger.info("containerURL is \(unwrapped)")
                return unwrapped.absoluteString
            } else {
                logger.info("containerURL is nil")
                return ""
            }
        }

        Function("setSharedCredential") { (groupIdentifier: String, credential: String) -> Void in
            let logger = Logger()
            logger.info("setSharedCredential() called with groupIdentifier \(groupIdentifier) and credential \(credential)")
            
            let groupUserDefaults = UserDefaults(suiteName: groupIdentifier)
            groupUserDefaults?.set(credential, forKey: "SavedUserID")
        }

        Function("getSharedCredential") { (groupIdentifier: String) -> String? in
            let logger = Logger()
            logger.info("getSharedCredential() called with groupIdentifier \(groupIdentifier)")
            
            let groupUserDefaults = UserDefaults(suiteName: groupIdentifier)
            let credential = groupUserDefaults?.string(forKey: "SavedUserID")

            // logger.info("credential is \(credential)")

            return credential            
        }
        
        // Display overlay to advertise full app
        // https://developer.apple.com/documentation/app_clips/recommending_your_app_to_app_clip_users
        AsyncFunction("displayOverlay") {
            if #available(iOS 16, *) {
                guard let currentScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
                    throw MissingCurrentWindowSceneException()
                }
                
                let config = SKOverlay.AppClipConfiguration(position: .bottom)
                let overlay = SKOverlay(configuration: config)
                overlay.present(in: currentScene)
            }
        }.runOnQueue(DispatchQueue.main)
        
        Function("getBundleIdentifier") { () -> String? in
            let bundleIdentifier = Bundle.main.bundleIdentifier
            return bundleIdentifier
        }
    }
}
