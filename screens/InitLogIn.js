import React, {
  useState,
  useContext,
  useMemo,
  createContext,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  Pressable,
  Platform,
} from "react-native";
import APPWIDE from "../components/AppWide";

import COLORS from "../misc/COLORS";

import { useNavigation } from "@react-navigation/native";

import firebase from "firebase/compat";

// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

//FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyChtonwBnG-Jzs-gMJRbTChiv-mwt13rNY",
  authDomain: "unis-1.firebaseapp.com",
  projectId: "unis-1",
  storageBucket: "unis-1.appspot.com",
  messagingSenderId: "500039576121",
  appId: "1:500039576121:web:af595bd3bc72422d4fbbe8",
  measurementId: "G-HY5WS3ZXYD",
};

//FIREBASE APP

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const MyContext = createContext();

function InitLogIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigationHndl = useNavigation();
  const signIn = async () => {
    GoogleSignin.configure(
      Platform.OS === "android"
        ? {
            scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
            webClientId:
              "500039576121-j46pleau65gc22mn0id3ieudrdumbc7a.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            hostedDomain: "", // specifies a hosted domain restriction
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            accountName: "",
            androidClientId:
              "500039576121-2ht2n7jk53d7cicusekhrludk1gipj9j.apps.googleusercontent.com", // [Android] specifies an account name on the device that should be used
            iosClientId: "<FROM DEVELOPER CONSOLE>", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
            googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
            openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
            profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
          }
        : {}
    );
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      return signInWithCredential(
        getAuth(firebase.initializeApp(firebaseConfig)),
        googleCredential
      )
        .then((res) => {
          navigationHndl.navigate("Home");
        })
        .catch((err) => {
          console.log("err", err);
        });
      // setState({ userInfo });
    } catch (error) {
      console.log("error", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login successful, user is signed in
        const user = userCredential.user;
        console.log("Login successful:", user.uid);
        console.log("this is email!", email);
        navigationHndl.navigate("Home", { userEmail: email });
      })
      .catch((error) => {
        // Handle login errors
        console.error("Login error:", error);
      });
  };

  return (
    <View style={styles.screenStyle}>
      {/* Logo */}
      <View style={{}}>
        <Image
          source={require("../assets/newlogo.png")}
          style={{ height: 150, resizeMode: "contain" }}
        />
      </View>
      {/* Logo Copy Subtitle */}
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 25,
            marginTop: -10,
          }}
        >
          Fast
          <Text style={{ color: COLORS.mainGreen, fontSize: 28 }}>. </Text>
          Simple
          <Text style={{ color: COLORS.mainGreen, fontSize: 28 }}>. </Text>
          Secure
          <Text style={{ color: COLORS.mainGreen, fontSize: 28 }}>.</Text>
        </Text>
      </View>
      {/* Email */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email Address"
          placeholderTextColor={"lightgrey"}
          autoCapitalize="none"
        />
      </View>
      {/* Password */}
      <View>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={"lightgrey"}
        />
      </View>
      {/* Submit Button */}
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Submit</Text>
      </Pressable>

      {/* Google Sign In */}
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        disabled={false}
      />

      {/* Lost Password */}
      <View>
        <Text style={{ color: "lightgrey" }}>
          Lost password? Click here to reset
        </Text>
      </View>

      {/* Create Account Link */}
      <Pressable
        onPress={() => navigation.navigate("CreateAccount")}
        style={{ marginTop: 40, alignSelf: "center" }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          New to{" "}
          <Text style={{ fontWeight: "700", color: COLORS.mainGreen }}>
            UNIS
          </Text>
          ?
        </Text>
        <Text style={{ color: "lightgrey", textAlign: "center" }}>
          Click here to create your account
        </Text>
      </Pressable>

      {/* Footer */}
      <View>
        <Text style={{ color: "white", marginTop: 60 }}>
          Powered by{" "}
          <Text style={{ fontWeight: "700", color: "#ffd500" }}>
            UNIS Media
          </Text>
          . All rights reserved. 2023
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.black,
  },
  label: {
    marginBottom: 5,
    color: "lightgrey",
    textAlign: "left",
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
  },
  input: {
    height: 60,
    width: 300,
    paddingLeft: 15,
    backgroundColor: COLORS.grey,
    borderRadius: 4,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.mainGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 30,
    marginBottom: 15,
  },
});

export default InitLogIn;
