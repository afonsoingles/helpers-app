import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, ActivityIndicator, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import ScheduleSelector from './ScheduleSelector';

const GalleryHelperInstallModal = ({ visible, helper, onClose, onInstall, isLoading, isInstalling }) => {
  const [editedParams, setEditedParams] = useState({});
  const [editedSchedule, setEditedSchedule] = useState([]);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (helper && visible) {
      // Initialize with default values based on parameter types
      const defaultParams = {};
      if (helper.params) {
        Object.entries(helper.params).forEach(([paramName, paramType]) => {
          switch (paramType) {
            case 'bool':
              defaultParams[paramName] = false;
              break;
            case 'int':
              defaultParams[paramName] = 0;
              break;
            case 'str':
            default:
              defaultParams[paramName] = '';
              break;
          }
        });
      }
      setEditedParams(defaultParams);
      setEditedSchedule([]);
      setIsActivated(false);
    }
  }, [helper, visible]);

  // Show activation success when installation completes
  useEffect(() => {
    if (isInstalling === false && editedParams && Object.keys(editedParams).length > 0) {
      setIsActivated(true);
      // Auto close after 2 seconds
      setTimeout(() => {
        setIsActivated(false);
        onClose();
      }, 2000);
    }
  }, [isInstalling]);

  const handleParamChange = (paramName, value) => {
    setEditedParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleScheduleChange = (scheduleArray) => {
    setEditedSchedule(scheduleArray);
  };

  const handleInstall = () => {
    if (onInstall) {
      onInstall(editedParams, editedSchedule);
    }
  };

  const renderParameterInput = (paramName, paramType, value) => {
    switch (paramType) {
      case 'bool':
        return (
          <View style={styles.switchContainer}>
            <Text style={styles.paramLabel}>{paramName}</Text>
            <Switch
              value={Boolean(value)}
              onValueChange={(newValue) => handleParamChange(paramName, newValue)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={Boolean(value) ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        );
      case 'int':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.paramLabel}>{paramName}</Text>
            <TextInput
              style={styles.paramInput}
              value={String(value || '')}
              onChangeText={(text) => handleParamChange(paramName, text)}
              keyboardType="numeric"
              placeholder={`Enter ${paramName}`}
              placeholderTextColor="#888"
            />
          </View>
        );
      case 'str':
      default:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.paramLabel}>{paramName}</Text>
            <TextInput
              style={styles.paramInput}
              value={String(value || '')}
              onChangeText={(text) => handleParamChange(paramName, text)}
              placeholder={`Enter ${paramName}`}
              placeholderTextColor="#888"
            />
          </View>
        );
    }
  };

  if (!helper) return null;

  // Show activation success screen
  if (isActivated) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.activationContainer}>
            <Image 
              source={require('../assets/icons/check.png')} 
              style={styles.checkIcon}
              resizeMode="contain"
            />
            <Text style={styles.activationTitle}>Activated!</Text>
            <Text style={styles.activationSubtitle}>
              {helper.name || helper.id} has been successfully activated
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Activate {helper.name || helper.id}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Image 
                source={require('../assets/icons/close.png')} 
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent} 
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Description */}
            {helper.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{helper.description}</Text>
              </View>
            )}

            {/* Parameters Section */}
            {helper.params && Object.keys(helper.params).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuration</Text>
                {Object.entries(helper.params).map(([paramName, paramType]) => (
                  <View key={paramName} style={styles.paramContainer}>
                    {renderParameterInput(paramName, paramType, editedParams[paramName])}
                  </View>
                ))}
              </View>
            )}

            {/* Schedule Section */}
            {helper.allow_execution_time_config && (
              <View style={styles.section}>
                <ScheduleSelector
                  onScheduleChange={handleScheduleChange}
                  initialSchedule={editedSchedule}
                />
              </View>
            )}

            {/* Admin Warning */}
            {helper.require_admin_activation && (
              <View style={styles.warningSection}>
                <Text style={styles.warningText}>
                  ⚠️ This helper requires admin approval to activate after installation.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isInstalling}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.installButton}
              onPress={handleInstall}
              disabled={isInstalling}
            >
              {isInstalling ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.installButtonText}>Activate Helper</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  activationContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(16),
    padding: RFValue(40),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: RFValue(280),
  },
  checkIcon: {
    width: RFValue(60),
    height: RFValue(60),
    marginBottom: RFValue(20),
  },
  activationTitle: {
    fontSize: RFValue(24),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#4CAF50',
    marginBottom: RFValue(8),
  },
  activationSubtitle: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
    textAlign: 'center',
    lineHeight: RFValue(22),
  },
  modalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(16),
    width: '92%',
    maxWidth: RFValue(520),
    height: '75%',
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    fontSize: RFValue(20),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    width: RFValue(32),
    height: RFValue(32),
    borderRadius: RFValue(16),
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: RFValue(16),
    height: RFValue(16),
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    padding: RFValue(20),
  },
  section: {
    marginBottom: RFValue(20),
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
    marginBottom: RFValue(12),
  },
  descriptionText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
    lineHeight: RFValue(20),
  },
  paramContainer: {
    marginBottom: RFValue(16),
  },
  inputContainer: {
    marginBottom: RFValue(12),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RFValue(8),
  },
  paramLabel: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#fff',
    marginBottom: RFValue(6),
  },
  paramInput: {
    backgroundColor: '#444',
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(10),
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#555',
  },
  warningSection: {
    backgroundColor: '#FF9800',
    padding: RFValue(12),
    borderRadius: RFValue(8),
    marginTop: RFValue(10),
  },
  warningText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#fff',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    padding: RFValue(20),
    gap: RFValue(12),
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    backgroundColor: '#666',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  installButton: {
    flex: 1,
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  installButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
});

export default GalleryHelperInstallModal;
