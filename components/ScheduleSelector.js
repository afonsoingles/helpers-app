import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const ScheduleSelector = ({ onScheduleChange, initialSchedule = [] }) => {
  const [schedules, setSchedules] = useState([]);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempFrequency, setTempFrequency] = useState('');
  const [tempTime, setTempTime] = useState({ hour: 10, minute: 0 });
  const [isOpeningTimeModal, setIsOpeningTimeModal] = useState(false);

  const frequencies = [
    { key: 'day', label: 'Day' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
    { key: 'month', label: 'Month' }
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (initialSchedule && initialSchedule.length > 0) {
      // Convert CRON expressions back to schedule objects
      const convertedSchedules = initialSchedule.map(cron => {
        const parts = cron.split(' ');
        if (parts.length === 5) {
          const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
          
          if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            return { frequency: 'day', time: { hour: parseInt(hour), minute: parseInt(minute) } };
          } else if (dayOfMonth === '*' && month === '*') {
            // Map CRON day numbers back to day names
            const dayMap = {
              '0': 'sunday',
              '1': 'monday', 
              '2': 'tuesday',
              '3': 'wednesday',
              '4': 'thursday',
              '5': 'friday',
              '6': 'saturday'
            };
            return { frequency: dayMap[dayOfWeek] || 'monday', time: { hour: parseInt(hour), minute: parseInt(minute) } };
          } else if (dayOfWeek === '*') {
            return { frequency: 'month', time: { hour: parseInt(hour), minute: parseInt(minute) } };
          }
        }
        return { frequency: 'day', time: { hour: 8, minute: 0 } };
      });
      setSchedules(convertedSchedules);
    }
  }, [initialSchedule]);

  const generateCronExpression = (frequency, time) => {
    const dayMap = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6,
      'sunday': 0
    };

    switch (frequency) {
      case 'day':
        return `${time.minute} ${time.hour} * * *`;
      case 'monday':
      case 'tuesday':
      case 'wednesday':
      case 'thursday':
      case 'friday':
      case 'saturday':
      case 'sunday':
        return `${time.minute} ${time.hour} * * ${dayMap[frequency]}`;
      case 'month':
        return `${time.minute} ${time.hour} 1 * *`;
      default:
        return `${time.minute} ${time.hour} * * *`;
    }
  };

  const addSchedule = () => {
    const newSchedule = {
      frequency: tempFrequency,
      time: tempTime
    };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    
    const cronExpressions = updatedSchedules.map(s => generateCronExpression(s.frequency, s.time));
    onScheduleChange(cronExpressions);
    
    setShowFrequencyModal(false);
    setShowTimeModal(false);
  };

  const editSchedule = (index) => {
    const schedule = schedules[index];
    setIsOpeningTimeModal(true);
    setTempFrequency(schedule.frequency);
    setTempTime(schedule.time);
    setEditingIndex(index);
    
    // Use setTimeout to make the modal opening smoother
    setTimeout(() => {
      setShowTimeModal(true);
      setIsOpeningTimeModal(false);
    }, 100);
  };

  const editFrequency = (index) => {
    const schedule = schedules[index];
    setTempFrequency(schedule.frequency);
    setTempTime(schedule.time);
    setEditingIndex(index);
    setShowFrequencyModal(true);
  };

  const updateSchedule = () => {
    const updatedSchedules = [...schedules];
    updatedSchedules[editingIndex] = {
      frequency: tempFrequency,
      time: tempTime
    };
    setSchedules(updatedSchedules);
    
    const cronExpressions = updatedSchedules.map(s => generateCronExpression(s.frequency, s.time));
    onScheduleChange(cronExpressions);
    
    setShowFrequencyModal(false);
    setShowTimeModal(false);
    setEditingIndex(-1);
  };

  const removeSchedule = (index) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
    
    const cronExpressions = updatedSchedules.map(s => generateCronExpression(s.frequency, s.time));
    onScheduleChange(cronExpressions);
  };

  const formatTime = (time) => {
    const h = time.hour.toString().padStart(2, '0');
    const m = time.minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const getFrequencyLabel = (frequency) => {
    return frequencies.find(f => f.key === frequency)?.label || 'Select...';
  };

  const renderScheduleCard = (schedule, index) => (
    <View key={index} style={styles.scheduleCard}>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleText}>Every</Text>
          
          <TouchableOpacity 
            style={styles.frequencyButton}
            onPress={() => editFrequency(index)}
          >
            <Text style={styles.frequencyButtonText}>{getFrequencyLabel(schedule.frequency)}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        
        <Text style={styles.scheduleText}>at</Text>
        
        <TouchableOpacity 
          style={[styles.timeButton, isOpeningTimeModal && styles.timeButtonLoading]}
          onPress={() => editSchedule(index)}
          disabled={isOpeningTimeModal}
        >
          <Text style={styles.timeButtonText}>{formatTime(schedule.time)}</Text>
          <Text style={styles.clockIcon}>🕐</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeSchedule(index)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFrequencyModal = () => (
    <Modal
      visible={showFrequencyModal}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowFrequencyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Frequency</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowFrequencyModal(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {frequencies.map(freq => (
            <TouchableOpacity
              key={freq.key}
              style={[
                styles.frequencyOption,
                tempFrequency === freq.key && styles.frequencyOptionSelected
              ]}
              onPress={() => {
                if (editingIndex >= 0) {
                  // If editing existing schedule, update it immediately with new frequency
                  const updatedSchedules = [...schedules];
                  updatedSchedules[editingIndex] = {
                    frequency: freq.key,
                    time: tempTime
                  };
                  setSchedules(updatedSchedules);
                  
                  const cronExpressions = updatedSchedules.map(s => generateCronExpression(s.frequency, s.time));
                  onScheduleChange(cronExpressions);
                  
                  setShowFrequencyModal(false);
                  setEditingIndex(-1);
                } else {
                  // If adding new schedule, set temp frequency and go to time modal
                  setTempFrequency(freq.key);
                  setShowFrequencyModal(false);
                  setShowTimeModal(true);
                }
              }}
            >
              <Text style={[
                styles.frequencyOptionText,
                tempFrequency === freq.key && styles.frequencyOptionTextSelected
              ]}>
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderTimeModal = () => (
    <Modal
      visible={showTimeModal}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowTimeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Time</Text>
          <View style={styles.timePickerContainer}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Hour</Text>
              <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                {hours.map(hour => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeOption,
                      tempTime.hour === hour && styles.timeOptionSelected
                    ]}
                    onPress={() => setTempTime(prev => ({ ...prev, hour }))}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      tempTime.hour === hour && styles.timeOptionTextSelected
                    ]}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Minute</Text>
              <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                {minutes.map(minute => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timeOption,
                      tempTime.minute === minute && styles.timeOptionSelected
                    ]}
                    onPress={() => setTempTime(prev => ({ ...prev, minute }))}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      tempTime.minute === minute && styles.timeOptionTextSelected
                    ]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowTimeModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={editingIndex >= 0 ? updateSchedule : addSchedule}
            >
              <Text style={styles.confirmButtonText}>
                {editingIndex >= 0 ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Configuration</Text>
      
      {schedules.map((schedule, index) => renderScheduleCard(schedule, index))}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setTempFrequency('');
          setTempTime({ hour: 10, minute: 0 });
          setEditingIndex(-1);
          setShowFrequencyModal(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Schedule</Text>
      </TouchableOpacity>

      {renderFrequencyModal()}
      {renderTimeModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: RFValue(20),
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
    marginBottom: RFValue(16),
  },
  scheduleCard: {
    backgroundColor: '#333',
    borderRadius: RFValue(8),
    padding: RFValue(20),
    marginBottom: RFValue(16),
    borderWidth: 1,
    borderColor: '#555',
    position: 'relative',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingRight: RFValue(50), // More space for remove button
    gap: RFValue(8),
  },
  scheduleText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
  },
  frequencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: RFValue(6),
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(8),
    borderWidth: 1,
    borderColor: '#2196F3',
    minWidth: RFValue(100),
  },
  frequencyButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#fff',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: RFValue(10),
    color: '#2196F3',
    marginLeft: RFValue(4),
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: RFValue(6),
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(8),
    borderWidth: 1,
    borderColor: '#555',
    minWidth: RFValue(80),
  },
  timeButtonLoading: {
    opacity: 0.6,
  },
  timeButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#fff',
    flex: 1,
  },
  clockIcon: {
    fontSize: RFValue(12),
    color: '#ccc',
    marginLeft: RFValue(4),
  },
  removeButton: {
    position: 'absolute',
    top: RFValue(12),
    right: RFValue(12),
    width: RFValue(24),
    height: RFValue(24),
    borderRadius: RFValue(12),
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: RFValue(16),
    color: '#fff',
    fontFamily: 'RedHatDisplay_600SemiBold',
  },
  addButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: RFValue(8),
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  modalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(12),
    padding: RFValue(20),
    width: '100%',
    maxWidth: RFValue(300),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(16),
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_600SemiBold',
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
  closeButtonText: {
    fontSize: RFValue(18),
    color: '#fff',
    fontFamily: 'RedHatDisplay_600SemiBold',
  },
  frequencyOption: {
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    borderRadius: RFValue(6),
    marginBottom: RFValue(8),
    backgroundColor: '#444',
  },
  frequencyOptionSelected: {
    backgroundColor: '#2196F3',
  },
  frequencyOptionText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#ccc',
    textAlign: 'center',
  },
  frequencyOptionTextSelected: {
    color: '#fff',
  },
  timePickerContainer: {
    flexDirection: 'row',
    gap: RFValue(16),
    marginBottom: RFValue(20),
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#ccc',
    marginBottom: RFValue(8),
    textAlign: 'center',
  },
  timeScroll: {
    maxHeight: RFValue(120),
    backgroundColor: '#333',
    borderRadius: RFValue(6),
  },
  timeOption: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(12),
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: '#2196F3',
  },
  timeOptionText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
  },
  timeOptionTextSelected: {
    color: '#fff',
    fontFamily: 'RedHatDisplay_600SemiBold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: RFValue(12),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: RFValue(12),
    borderRadius: RFValue(6),
    backgroundColor: '#666',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: RFValue(12),
    borderRadius: RFValue(6),
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
});

export default ScheduleSelector;