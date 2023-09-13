import { StyleSheet, Text, View } from "react-native";

import * as ReactNativeAppClip from "react-native-app-clip";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeAppClip.isClip()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
