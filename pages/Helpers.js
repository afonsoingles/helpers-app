import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert
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
  getUserActiveHelpers,
  updateHelper,
  unregisterHelper
} from "../utils/HelpersManager";
import NavigationBar from "../components/NavigationBar";
import LinearGradient from "react-native-linear-gradient";
import HelperCard from "../components/HelperCard";

const Helpers = () => {
  const [userData, setUserData] = useState();
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const [helperLoadingStates, setHelperLoadingStates] = useState({});
  const [helperErrors, setHelperErrors] = useState({});

  const [fontsLoaded] = useFonts({
    RedHatDisplay_400Regular,
    RedHatDisplay_700Bold,
    RedHatDisplay_600SemiBold,
    RedHatDisplay_800ExtraBold,
    RedHatDisplay_300Light
  });

  const loadHelpers = async () => {
    setLoading(true);
    try {
      const userData = await getAccountData();
      setUserData(userData);
      
      const activeHelpers = await getUserActiveHelpers(userData);
      setHelpers(activeHelpers || []);
    } catch (error) {
      console.log('Error loading helpers:', error);
      setHelpers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpers();
  }, []);

  const handleToggleHelper = async (helperId, enabled) => {
    // Set loading state for this specific helper
    setHelperLoadingStates(prev => ({ ...prev, [helperId]: true }));
    setHelperErrors(prev => ({ ...prev, [helperId]: null }));
    
    try {
      const result = await updateHelper(helperId, null, null, enabled);
      
      if (result.success) {
        // Update local state
        setHelpers(prevHelpers => 
          prevHelpers.map(helper => 
            helper.id === helperId 
              ? { ...helper, enabled: enabled }
              : helper
          )
        );
        
        // Refresh user data
        const updatedUserData = await getAccountData();
        setUserData(updatedUserData);
      } else {
        setHelperErrors(prev => ({ 
          ...prev, 
          [helperId]: result.message || 'Failed to update helper' 
        }));
      }
    } catch (error) {
      console.log('Error toggling helper:', error);
      setHelperErrors(prev => ({ 
        ...prev, 
        [helperId]: 'Failed to update helper' 
      }));
    } finally {
      setHelperLoadingStates(prev => ({ ...prev, [helperId]: false }));
    }
  };

  const handleDeleteHelper = async (helperId) => {
    // Set loading state for this specific helper
    setHelperLoadingStates(prev => ({ ...prev, [helperId]: true }));
    setHelperErrors(prev => ({ ...prev, [helperId]: null }));
    
    try {
      const result = await unregisterHelper(helperId);
      
      if (result.success) {
        // Remove from local state
        setHelpers(prevHelpers => 
          prevHelpers.filter(helper => helper.id !== helperId)
        );
        
        // Refresh user data
        const updatedUserData = await getAccountData();
        setUserData(updatedUserData);
      } else {
        setHelperErrors(prev => ({ 
          ...prev, 
          [helperId]: result.message || 'Failed to delete helper' 
        }));
      }
    } catch (error) {
      console.log('Error deleting helper:', error);
      setHelperErrors(prev => ({ 
        ...prev, 
        [helperId]: 'Failed to delete helper' 
      }));
    } finally {
      setHelperLoadingStates(prev => ({ ...prev, [helperId]: false }));
    }
  };

  const handleEditHelper = async (helperId, params, schedule) => {
    // Set loading state for this specific helper
    setHelperLoadingStates(prev => ({ ...prev, [helperId]: true }));
    setHelperErrors(prev => ({ ...prev, [helperId]: null }));
    
    try {
      const result = await updateHelper(helperId, params, schedule);
      
      if (result.success) {
        // Update local state
        setHelpers(prevHelpers => 
          prevHelpers.map(helper => 
            helper.id === helperId 
              ? { ...helper, params: params, schedule: schedule }
              : helper
          )
        );
        
        // Refresh user data
        const updatedUserData = await getAccountData();
        setUserData(updatedUserData);
      } else {
        setHelperErrors(prev => ({ 
          ...prev, 
          [helperId]: result.message || 'Failed to update helper' 
        }));
      }
    } catch (error) {
      console.log('Error updating helper:', error);
      setHelperErrors(prev => ({ 
        ...prev, 
        [helperId]: 'Failed to update helper' 
      }));
    } finally {
      setHelperLoadingStates(prev => ({ ...prev, [helperId]: false }));
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    setShowTopFade(contentOffset.y > 0.1);

    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height;
    setShowBottomFade(!isAtBottom);
  };

  if (!fontsLoaded || !userData) return null;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig subtitle="Helpers" />

        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.helpersView}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading helpers...</Text>
              </View>
            ) : !helpers || helpers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No helpers configured yet!</Text>
                <Text style={styles.emptySubtext}>
                  Add helpers from the gallery to get started with automations.
                </Text>
              </View>
            ) : (
              <View style={styles.helpersList}>
                {(helpers || []).map((helper, index) => (
                  <HelperCard
                    key={index}
                    helper={helper}
                    onToggle={handleToggleHelper}
                    onDelete={handleDeleteHelper}
                    onEdit={handleEditHelper}
                    isLoading={helperLoadingStates[helper.id] || false}
                    error={helperErrors[helper.id] || null}
                  />
                ))}
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
          <NavigationBar tab="helpers" userInfo={userData || null} />
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
  helpersView: {
    paddingHorizontal: RFValue(5),
    paddingTop: RFValue(5),
    height: RFPercentage(70),
    marginBottom: RFValue(60),
  },
  helpersList: {
    paddingBottom: RFValue(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: RFValue(60),
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
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: RFValue(10)
  },
  emptySubtext: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: RFValue(20)
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

export default Helpers;
