import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import HeaderBig from "../components/HeaderBig";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  useFonts,
  RedHatDisplay_400Regular,
  RedHatDisplay_700Bold,
  RedHatDisplay_600SemiBold,
  RedHatDisplay_300Light,
  RedHatDisplay_800ExtraBold,
} from "@expo-google-fonts/red-hat-display";
import { useNavigation } from "@react-navigation/native";
import { getAccountData } from "../utils/AuthManager";
import { registerForPushNotificationsAsync } from "../utils/NotificationsManager";
const Home = ({}) => {
  const [userData, setUserData] = useState();
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_800ExtraBold,
    RedHatDisplay_300Light,
  });
  registerForPushNotificationsAsync()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getAccountData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);
  if (!fontsLoaded) return null;
  if (!userData) return null;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig
          subtitle={`Welcome ${userData.name}!`}
          style={{ fontFamily: "RedHatDisplay_800ExtraBold" }}
        />
        <View style={[styles.AlignBottom, { marginBottom: RFValue(15) }]}>
          <View style={{ marginTop: RFValue(0) }}>
            <TouchableOpacity
              style={[buttonStyles.button]}
              disabled={false}
              onPress={() => {
                navigation.navigate('MainRoutes', { screen: 'Settings' });
              }}
             >
              <Text style={[buttonStyles.buttonText]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AlignBottom: {
    position: "relative",
    marginTop: Platform.OS === "android" ? RFPercentage(60) : RFPercentage(20),
    gap: 10,
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    width: "62%",
    height: RFValue(40),
    backgroundColor: "#8c52ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 11,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: RFValue(110),
    resizeMode: "contain",
    maxWidth: "95%",
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontFamily: "RedHatDisplay_800ExtraBold",
  },
  image: {
    width: 10,
    height: 10,
  },
});

export default Home;
