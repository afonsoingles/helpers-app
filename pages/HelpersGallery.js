import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackgroundWrapper from '../components/BackgroundWrapper';
import HeaderBig from '../components/HeaderBig';
import NavigationBar from '../components/NavigationBar';
import GalleryHelperCard from '../components/GalleryHelperCard';
import { getAvailableHelpers, installHelper } from '../utils/HelpersManager';
import { getAccountData } from '../utils/AuthManager';

const HelpersGallery = () => {
  const navigation = useNavigation();
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [installingHelpers, setInstallingHelpers] = useState({});
  const [helperErrors, setHelperErrors] = useState({});
  const [error, setError] = useState(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen comes into focus (e.g., when back button is pressed)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load user data and available helpers in parallel
      const [userDataResult, availableHelpers] = await Promise.all([
        getAccountData(),
        getAvailableHelpers()
      ]);
      
      setUserData(userDataResult);

      const userRegion = userDataResult?.region || null;
      const userInstalledIds = new Set(
        (userDataResult?.services || []).map(s => s?.id).filter(Boolean)
      );

      const filtered = (availableHelpers || []).filter(helper => {
        if (!helper) return false;
        if (helper.admin_only === true) return false;
        if (userInstalledIds.has(helper.id)) return false;

        const regionLock = helper.region_lock;
        if (!regionLock || regionLock === '*' || (Array.isArray(regionLock) && regionLock.includes('*'))) {
          return true;
        }
        if (!userRegion) return false;
        if (typeof regionLock === 'string') {
          return regionLock === userRegion;
        }
        if (Array.isArray(regionLock)) {
          return regionLock.includes(userRegion);
        }
        return true;
      });

      setHelpers(filtered);
    } catch (err) {
      console.error('Error loading gallery data:', err);
      setError('Failed to load helpers gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleInstallHelper = async (helperId, params, schedule) => {
    try {
      setInstallingHelpers(prev => ({ ...prev, [helperId]: true }));
      setHelperErrors(prev => ({ ...prev, [helperId]: null }));
      
      const result = await installHelper(helperId, params, schedule);
      
      if (result === 'ok') {
        // Refresh user data to get updated helpers list
        const updatedUserData = await getAccountData();
        setUserData(updatedUserData);
        
        // Show success feedback (you could add a toast here)
        console.log('Helper installed successfully');
      } else {
        throw new Error('Installation failed');
      }
    } catch (err) {
      console.error('Error installing helper:', err);
      setHelperErrors(prev => ({ ...prev, [helperId]: `Failed to install: ${err.message}` }));
    } finally {
      setInstallingHelpers(prev => ({ ...prev, [helperId]: false }));
    }
  };

  const isHelperInstalled = (helperId) => {
    if (!userData?.services) return false;
    return userData.services.some(service => service.id === helperId);
  };

  const getInstalledHelper = (helperId) => {
    if (!userData?.services) return null;
    return userData.services.find(service => service.id === helperId);
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    // Recalculate fade conditions with improved logic
    const contentExceedsScreen = contentSize.height > layoutMeasurement.height + 1; // Added buffer for iOS
    const isAtBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 1; // Adjusted threshold

    console.log('Scroll Debug:', {
      platform: Platform.OS,
      layoutHeight: layoutMeasurement.height,
      contentHeight: contentSize.height,
      contentOffsetY: contentOffset.y,
      contentExceedsScreen,
      isAtBottom,
      topFadeCondition: contentOffset.y > 0.1,
      bottomFadeCondition: contentExceedsScreen && !isAtBottom,
    });

    setShowTopFade(contentOffset.y > 0.1);
    setShowBottomFade(contentExceedsScreen && !isAtBottom);
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <HeaderBig subtitle="Helpers Gallery" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading helpers gallery...</Text>
          </View>
          <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
            <NavigationBar tab="helpers" userInfo={userData || null} />
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  if (error) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <HeaderBig subtitle="Helpers Gallery" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
            <NavigationBar tab="helpers" userInfo={userData || null} />
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <HeaderBig subtitle="Helpers Gallery" />
        
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.galleryView}
            contentContainerStyle={styles.galleryViewContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {helpers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No helpers available, sorry!</Text>
              </View>
            ) : (
              helpers.map((helper, index) => (
                <GalleryHelperCard
                  key={helper.id || index}
                  helper={helper}
                  onInstall={handleInstallHelper}
                  isInstalling={installingHelpers[helper.id] || false}
                  isInstalled={isHelperInstalled(helper.id)}
                  installedHelper={getInstalledHelper(helper.id)}
                  errorMessage={helperErrors[helper.id]}
                />
              ))
            )}
          </ScrollView>

          {/* Fades */}
          {console.log('Gallery Fade States:', { showTopFade, showBottomFade })}
          {/* Temporarily disable LinearGradient for debugging */}
          {showTopFade && (
            console.log('Rendering top fade'),
            null // Disable top fade for debugging
          )}
          {showBottomFade && (
            console.log('Rendering bottom fade'),
            null // Disable bottom fade for debugging
          )}
        </View>

        <View style={[styles.AlignBottom, { paddingHorizontal: RFValue(20) }]}>
          <NavigationBar tab="helpers" userInfo={userData || null} />
        </View>

        {/* Back Button - Inline with HeaderBig */}
        <TouchableOpacity 
          style={styles.inlineBackButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icons/back-arrow.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inlineBackButton: {
    position: 'absolute',
    top: RFValue(50),
    right: RFValue(20),
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backIcon: {
    width: RFValue(20),
    height: RFValue(20),
  },
  AlignBottom: {
    position: "absolute",
    bottom: "2%",
    width: "100%",
    gap: 10
  },
  galleryView: {
    flex: 1,
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(5),
  },
  galleryViewContent: {
    paddingBottom: RFValue(120),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#fff',
    marginTop: RFValue(10),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  errorText: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(8),
  },
  retryButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
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
  },
});

export default HelpersGallery;
