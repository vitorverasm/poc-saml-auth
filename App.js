import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAuthMethods, getUserInfo } from "./src/services/api";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [authMethods, setAuthMethods] = useState([]);

  useEffect(() => {
    AuthSession.dismiss();

    const loadAuthMethods = async () => {
      const methods = await getAuthMethods();
      console.log(`[auth methods]`, methods);
      setAuthMethods(methods);
    };
    loadAuthMethods();
    return () => {};
  }, []);

  const login = async (url) => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        "pocsaml://auth/saml"
      );
      let redirectData;
      if (result.url) {
        redirectData = Linking.parse(result.url);
      }
      // const result = await AuthSession.startAsync({
      //   authUrl: url,
      //   returnUrl: "pocsaml://auth/saml",
      // });
      console.log("redirectData", redirectData.queryParams);
      if (redirectData.queryParams) {
        await getUserInfo(redirectData.queryParams.token);
      }
    } catch (error) {
      console.log("login error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.title}>POC SAML</Text>

        <FlatList
          data={authMethods}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => login(item.directUrl)}
              style={styles.buttonWrapper}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 30,
  },
  buttonText: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  buttonContainer: {
    borderRadius: 8,
    height: 50,
    backgroundColor: "#1e1e1e",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 150,
  },
  buttonWrapper: { marginTop: 20 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e1e1e",
  },
});
