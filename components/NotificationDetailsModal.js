import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const NotificationDetailsModal = ({ visible, notification, onClose }) => {
  if (!notification) return null;

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      const d = new Date(value);
      const pad = (n) => String(n).padStart(2, '0');
      const day = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return value;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Notification Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image source={require('../assets/icons/close.png')} style={styles.closeIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{notification.title || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Body</Text>
              <Text style={styles.value}>{notification.body || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.valueMono}>{notification.from || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Created At</Text>
              <Text style={styles.value}>{formatDate(notification.createdAt)}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(16),
    width: '100%',
    height: '85%',
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  title: {
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
  content: {
    flex: 1,
  },
  contentInner: {
    padding: RFValue(20),
    gap: RFValue(12),
  },
  row: {
    gap: RFValue(6),
  },
  rowInline: {
    flexDirection: 'row',
    gap: RFValue(12),
  },
  inlineItem: {
    flex: 1,
    gap: RFValue(6),
  },
  label: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_500Medium',
    color: '#bbb',
  },
  value: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  valueMono: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#e0e0e0',
  },
  codeBlock: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: RFValue(8),
    padding: RFValue(12),
  },
  codeText: {
    color: '#d6deeb',
    fontFamily: 'monospace',
    fontSize: RFValue(12),
  },
});

export default NotificationDetailsModal;


