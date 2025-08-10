import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator
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
  RedHatDisplay_800ExtraBold
} from "@expo-google-fonts/red-hat-display";
import { useNavigation } from "@react-navigation/native";
import { getAccountData } from "../utils/AuthManager";
import {
  loadUserNotifications,
  getNotificationDeviceStatus
} from "../utils/NotificationsManager";
import NavigationBar from "../components/NavigationBar";
import LinearGradient from "react-native-linear-gradient";
import NotificationContainer from "../components/NotificationContainer";
import NotificationBox from "../components/NotificationBox";

const Notifications = () => {
  const [userData, setUserData] = useState();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState("ready");
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);


  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_800ExtraBold,
    RedHatDisplay_300Light
  });

  const fetchNotifications = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await loadUserNotifications(page, 20)
      .then((newNotifications) => {
        if (newNotifications.length < 20) {
          setHasMore(false);
        }
        setNotifications((prev) => [...prev, ...newNotifications]);
        setPage((prev) => prev + 1);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const loadData = async () => {

      const userData = await getAccountData();
      setUserData(userData);

      const notificationStatus = await getNotificationDeviceStatus();
      setNotificationStatus(notificationStatus);
    };


    loadData();
    fetchNotifications();
  }, []);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    setShowTopFade(contentOffset.y > 0.1);

    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height;
    setShowBottomFade(!isAtBottom);

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      fetchNotifications();
    }
  };

  if (!fontsLoaded || !userData || !notificationStatus) return null;

  /*
    if (notificationStatus === "requireSetup") {
      return (
        <BackgroundWrapper>
          <View style={styles.container}>
            <HeaderBig subtitle="Notifications" />
            <View style={styles.setupContainer}>
              <Text style={styles.setupText}>
                heyo! it seems like you need to setup push config :O. i still need to implement this :C
              </Text>
              
            </View>
          </View>
        </BackgroundWrapper>
      );
    }
  */

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig subtitle="Notifications" />

        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.notificationView}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {notifications.map((notification, index) => (
              <NotificationContainer
                key={index}
                title={notification.title}
                body={notification.body}
                critical={notification.isCritical}
              />
            ))}
            {loading && (
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </ScrollView>

          {/* Fades */}
          {showTopFade && (
            <LinearGradient
              colors={["#211e1e", "transparent"]}
              style={styles.topFade}
              pointerEvents="none"
            />
          )}
          {showBottomFade && (
            <LinearGradient
              colors={["transparent", "#211e1e"]}
              style={styles.bottomFade}
              pointerEvents="none"
            />
          )}
        </View>

        <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
          <NavigationBar tab="notifications" userInfo={userData || null} />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  AlignBottom: {
    position: "absolute",
    bottom: "2%",
    width: "100%",
    gap: 10
  },
  notificationView: {
    paddingHorizontal: RFValue(5),
    paddingTop: RFValue(5),
    height: RFPercentage(70),
    marginBottom: RFValue(60),
  },
  setupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20)
  },
  setupText: {
    fontSize: RFValue(16),
    textAlign: "center",
    color: "#fff"
  },
  topFade: {
    position: "absolute",
    left: 0,
    right: 0,
    height: RFValue(60),
    zIndex: 2
  },
  bottomFade: {
    position: "absolute",
    bottom: RFValue(60), 
    left: 0,
    right: 0,
    height: RFValue(30),
    zIndex: 2
  }
});

export default Notifications;
