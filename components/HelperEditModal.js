import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const HelperEditModal = ({ visible, helper, onClose, onSave, isLoading }) => {
  const [editedParams, setEditedParams] = useState({});
  const [editedSchedule, setEditedSchedule] = useState('');

  useEffect(() => {
    if (helper && visible) {
      // Initialize with current values
      setEditedParams(helper.params || {});
      setEditedSchedule(helper.schedule ? helper.schedule.join('\n') : '');
    }
  }, [helper, visible]);

  const handleParamChange = (paramName, value) => {
    setEditedParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleScheduleChange = (text) => {
    setEditedSchedule(text);
  };

  const handleSave = () => {
    if (onSave) {
      // Convert schedule string to array
      const scheduleArray = editedSchedule
        .split('\n')
        .map(s => s.trim())
        .filter(s => s !== '');
      
      onSave(helper.id, editedParams, scheduleArray);
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.editModalOverlay}>
        <View style={styles.editModalContainer}>
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Edit {helper.name || helper.id}</Text>
            <TouchableOpacity 
              style={styles.editModalCloseButton}
              onPress={onClose}
            >
              <Text style={styles.editModalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.editModalContent} 
            contentContainerStyle={styles.editModalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Parameters Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parameters</Text>
              {helper.params && Object.keys(helper.params).length > 0 ? (
                Object.entries(helper.params).map(([paramName, paramType]) => (
                  <View key={paramName} style={styles.paramContainer}>
                    {renderParameterInput(paramName, paramType, editedParams[paramName])}
                  </View>
                ))
              ) : (
                <Text style={styles.noParamsText}>No parameters to configure</Text>
              )}
            </View>

            {/* Schedule Section */}
            {helper.allow_execution_time_config && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Schedule (CRON)</Text>
                <TextInput
                  style={styles.scheduleInput}
                  value={editedSchedule}
                  onChangeText={handleScheduleChange}
                  multiline
                  placeholder="Enter CRON expressions, one per line&#10;Examples:&#10;• 0 8 * * * (Every day at 8:00 AM)&#10;• 0 9 * * 3 (Every Wednesday at 9:00 AM)"
                  placeholderTextColor="#888"
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.editModalActions}>
            <TouchableOpacity
              style={styles.editModalCancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.editModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editModalSaveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.editModalSaveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  editModalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(16),
    width: '100%',
    height: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  editModalTitle: {
    fontSize: RFValue(20),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
    flex: 1,
  },
  editModalCloseButton: {
    width: RFValue(32),
    height: RFValue(32),
    borderRadius: RFValue(16),
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalCloseText: {
    fontSize: RFValue(16),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: RFValue(16),
  },
  editModalContent: {
    flex: 1,
  },
  editModalScrollContent: {
    padding: RFValue(20),
    flexGrow: 1,
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
  scheduleInput: {
    backgroundColor: '#444',
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(10),
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#555',
    minHeight: RFValue(100),
    textAlignVertical: 'top',
  },
  noParamsText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#888',
    fontStyle: 'italic',
  },
  editModalActions: {
    flexDirection: 'row',
    padding: RFValue(20),
    gap: RFValue(12),
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  editModalCancelButton: {
    flex: 1,
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    backgroundColor: '#666',
    alignItems: 'center',
  },
  editModalCancelText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  editModalSaveButton: {
    flex: 1,
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  editModalSaveText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
});

export default HelperEditModal;