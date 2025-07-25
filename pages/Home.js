import React, { useState, useEffect } from "react";
import {View, StyleSheet, Platform, Text } from "react-native";
import BackgroundWrapper from "../components/BackgroundWrapper";
import HeaderBig from "../components/HeaderBig";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_700Bold, RedHatDisplay_600SemiBold, RedHatDisplay_300Light, RedHatDisplay_800ExtraBold } from "@expo-google-fonts/red-hat-display";
import { useNavigation } from "@react-navigation/native";
import { getAccountData } from "../utils/AuthManager";
import { registerForPushNotificationsAsync } from "../utils/NotificationsManager";
import NavigationBar from "../components/NavigationBar";

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
        <HeaderBig subtitle={`Hello, ${userData.name}!`}/>
        <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20)}]}>
          <NavigationBar tab={"home"} userInfo={userData || null}/>
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
    marginTop: Platform.OS === "android" ? RFPercentage(70) : RFPercentage(20),
    gap: 10,
  },
});


export default Home;
