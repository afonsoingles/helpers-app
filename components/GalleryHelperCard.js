import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import GalleryHelperInstallModal from './GalleryHelperInstallModal';

const GalleryHelperCard = ({ helper, onInstall, isInstalling, isInstalled, installedHelper, errorMessage }) => {
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleInstallPress = () => {
    setShowInstallModal(true);
  };

  const handleInstall = async (params, schedule) => {
    if (onInstall) {
      await onInstall(helper.id, params, schedule);
      setShowInstallModal(false);
    }
  };

  const getStatusText = () => {
    if (isInstalled) {
      return installedHelper?.enabled ? 'Active' : 'Paused';
    }
    return 'Available';
  };

  const getStatusColor = () => {
    if (isInstalled) {
      return installedHelper?.enabled ? '#4CAF50' : '#FF9800';
    }
    return '#2196F3';
  };

  const canInstall = () => {
    // Check if helper has parameters or allows schedule configuration
    const hasParams = helper.params && Object.keys(helper.params).length > 0;
    const hasScheduleConfig = helper.allow_execution_time_config;
    return hasParams || hasScheduleConfig;
  };

  return (
    <View style={[styles.card, isInstalled && styles.installedCard]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{helper.name || helper.id}</Text>
          {helper.admin_only && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Description */}
      {helper.description && (
        <Text style={styles.description} numberOfLines={3}>
          {helper.description}
        </Text>
      )}

      {helper.require_admin_activation && (
        <View style={styles.adminConfigContainer}>
          <Text style={styles.adminConfigText}>Needs admin configuration</Text>
        </View>
      )}

      {/* Features */}
      <View style={styles.featuresContainer}>
        {helper.params && Object.keys(helper.params).length > 0 && (
          <View style={styles.featureItemRow}>
            <Image source={require('../assets/icons/equalizer.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>Supports custom parameters</Text>
          </View>
        )}
        {helper.allow_execution_time_config && (
          <View style={styles.featureItemRow}>
            <Image source={require('../assets/icons/clock.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>Custom schedule</Text>
          </View>
        )}
        {helper.boot_run && (
          <View style={styles.featureItemRow}>
            <Image source={require('../assets/icons/shuttle.png')} style={styles.featureIcon} />
            <Text style={styles.featureText}>Runs at startup</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {isInstalled ? (
          <View style={styles.installedContainer}>
            <Text style={styles.installedText}>
              {installedHelper?.enabled ? '✓ Active' : '✓ Paused'}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.installButton,
              (!canInstall() || isInstalling) && styles.disabledButton
            ]}
            onPress={handleInstallPress}
            disabled={!canInstall() || isInstalling}
          >
            {isInstalling ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={[
                styles.installButtonText,
                !canInstall() && styles.disabledButtonText
              ]}>
                {canInstall() ? 'Install' : 'No Configuration'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Error under card */}
      {errorMessage ? (
        <View style={styles.inlineErrorContainer}>
          <Text style={styles.inlineErrorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Install Modal */}
      <GalleryHelperInstallModal
        visible={showInstallModal}
        helper={helper}
        onClose={() => setShowInstallModal(false)}
        onInstall={handleInstall}
        isLoading={isInstalling}
        isInstalling={isInstalling}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(12),
    padding: RFValue(16),
    marginBottom: RFValue(16),
    borderWidth: 1,
    borderColor: '#444',
  },
  installedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#1a2a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: RFValue(12),
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
    marginRight: RFValue(8),
  },
  adminBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(2),
    borderRadius: RFValue(4),
  },
  adminBadgeText: {
    fontSize: RFValue(10),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(12),
  },
  statusText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  description: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
    lineHeight: RFValue(20),
    marginBottom: RFValue(12),
  },
  adminConfigContainer: {
    backgroundColor: '#FF9800',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(4),
    marginBottom: RFValue(12),
    alignSelf: 'flex-start',
  },
  adminConfigText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  featuresContainer: {
    marginBottom: RFValue(16),
    gap: RFValue(6),
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(8),
  },
  featureIcon: {
    width: RFValue(14),
    height: RFValue(14),
    tintColor: '#aaa',
  },
  featureText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#aaa',
  },
  actionsContainer: {
    alignItems: 'center',
  },
  installButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: RFValue(24),
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    minWidth: RFValue(120),
    alignItems: 'center',
  },
  installButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#888',
  },
  installedContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(8),
  },
  installedText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  inlineErrorContainer: {
    marginTop: RFValue(10),
    backgroundColor: '#4a1f1f',
    borderColor: '#ff6b6b',
    borderWidth: 1,
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(8),
  },
  inlineErrorText: {
    color: '#ff9b9b',
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_400Regular',
  },
});

export default GalleryHelperCard;
