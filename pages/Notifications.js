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
import { getAccountData } from "../utils/AuthManager";
import {
  loadUserNotifications,
  getNotificationDeviceStatus,
  checkInDevice
} from "../utils/NotificationsManager";
import NavigationBar from "../components/NavigationBar";
import LinearGradient from "react-native-linear-gradient";
import NotificationContainer from "../components/NotificationContainer";
import NotificationDetailsModal from "../components/NotificationDetailsModal";
import PushNotificationSetup from "../components/PushNotificationSetup";

const Notifications = () => {
  const [userData, setUserData] = useState();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState("ready");
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const [isPushSetup, setIsPushSetup] = useState(false);
  const [checkInInterval, setCheckInInterval] = useState(null);
  const [isCheckingNotificationStatus, setIsCheckingNotificationStatus] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);


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
      setIsCheckingNotificationStatus(true);
      
      const userData = await getAccountData();
      setUserData(userData);

      const notificationStatus = await getNotificationDeviceStatus();
      setNotificationStatus(notificationStatus);
      console.log("notificationStatus", notificationStatus);
      // Check if push notifications are properly set up
      const pushSetup = notificationStatus === "ok";
      console.log("pushSetup", pushSetup);
      setIsPushSetup(pushSetup);
      
      setIsCheckingNotificationStatus(false);
    };

    loadData();
    fetchNotifications();
  }, []);

  // Background check-in functionality
  useEffect(() => {
    const startCheckIn = () => {
      // Clear any existing interval
      if (checkInInterval) {
        clearInterval(checkInInterval);
      }

      // Set up new interval for check-in every 10 minutes
      const interval = setInterval(async () => {
        try {
          await checkInDevice();
        } catch (error) {
          console.log('Background check-in error:', error);
        }
      }, 10 * 60 * 1000); // 10 minutes

      setCheckInInterval(interval);
    };

    // Start check-in if push notifications are set up
    if (isPushSetup) {
      startCheckIn();
    }

    // Cleanup on unmount
    return () => {
      if (checkInInterval) {
        clearInterval(checkInInterval);
      }
    };
  }, [isPushSetup]);

  const handlePushSetupComplete = async (success) => {
    if (success) {
      // Immediately update the state to show notification list
      setIsPushSetup(true);
      setNotificationStatus("ok");
      
      // Refresh user data to get updated push configuration
      const updatedUserData = await getAccountData();
      setUserData(updatedUserData);
      
      // Load notifications immediately
      fetchNotifications();
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    console.log('Scroll Debug:', {
      layoutHeight: layoutMeasurement.height,
      contentHeight: contentSize.height,
      contentOffsetY: contentOffset.y,
    });

    setShowTopFade(contentOffset.y > 0.1);

    // Adjust fade logic to only show when content exceeds the screen size
    const contentExceedsScreen = contentSize.height > layoutMeasurement.height;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 1; // Adjusted threshold
    setShowBottomFade(contentExceedsScreen && !isAtBottom);
  };

  if (!fontsLoaded || !userData || !notificationStatus) return null;

  // Show loading while checking notification status
  if (isCheckingNotificationStatus) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <HeaderBig subtitle="Notifications" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
          <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
            <NavigationBar tab="notifications" userInfo={userData || null} />
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  // Show push notification setup if not configured
  if (!isPushSetup) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <HeaderBig subtitle="Notifications" />
          <PushNotificationSetup onSetupComplete={handlePushSetupComplete} />
          <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
            <NavigationBar tab="notifications" userInfo={userData || null} />
          </View>
        </View>
      </BackgroundWrapper>
    );
  }


  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig subtitle="Notifications" />

        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.notificationView}
            contentContainerStyle={styles.notificationViewContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {notifications.length === 0 && !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>There are no notifications, yet!</Text>
              </View>
            ) : (
              notifications.map((notification, index) => (
                <NotificationContainer
                  key={index}
                  title={notification.title}
                  body={notification.body}
                  critical={notification.isCritical}
                  onEyePress={() => { setSelectedNotification(notification); setDetailsVisible(true); }}
                />
              ))
            )}
            {loading && (
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </ScrollView>

          {/* Fades */}
          {showTopFade && (
            console.log('Rendering top fade'),
            null // Disable top fade for debugging
          )}
          {showBottomFade && (
            console.log('Rendering bottom fade'),
            null // Disable bottom fade for debugging
          )}
        </View>

        <NotificationDetailsModal
          visible={detailsVisible}
          notification={selectedNotification}
          onClose={() => setDetailsVisible(false)}
        />

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
    flex: 1,
    paddingHorizontal: RFValue(5),
    paddingTop: RFValue(5),
  },
  notificationViewContent: {
    paddingBottom: RFValue(120),
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
    bottom: RFValue(90),
    left: 0,
    right: 0,
    height: RFValue(30),
    zIndex: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20)
  },
  loadingText: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#e0e0e0',
    marginTop: RFValue(15),
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: RFValue(60),
    paddingHorizontal: RFValue(20)
  },
  emptyText: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: RFValue(26)
  }
});

export default Notifications;
