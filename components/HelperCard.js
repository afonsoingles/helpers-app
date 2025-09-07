import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { formatSchedule, formatParameters } from '../utils/HelpersManager';
import HelperEditModal from './HelperEditModal';

const HelperCard = ({ helper, onToggle, onDelete, onEdit, isLoading, error }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'delete' or 'edit'
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check if helper has anything to configure
  const hasConfigurableContent = () => {
    const hasParams = helper.params && Object.keys(helper.params).length > 0;
    const hasScheduleConfig = helper.allow_execution_time_config;
    return hasParams || hasScheduleConfig;
  };

  const handleToggle = async () => {
    if (onToggle && !isToggling) {
      setIsToggling(true);
      try {
        await onToggle(helper.id, !helper.enabled);
      } finally {
        setIsToggling(false);
      }
    }
  };

  const handleDelete = () => {
    setActionType('delete');
    setShowActionModal(true);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleInfoPress = () => {
    setShowInfoModal(true);
  };

  const handleEditSave = async (helperId, params, schedule) => {
    if (onEdit && !isEditing) {
      setIsEditing(true);
      try {
        await onEdit(helperId, params, schedule);
        setShowEditModal(false);
      } finally {
        setIsEditing(false);
      }
    }
  };

  const confirmAction = async () => {
    if (actionType === 'delete' && onDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(helper.id);
        setShowActionModal(false);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <View style={[styles.card, helper.enabled ? styles.enabledCard : styles.disabledCard]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{helper.name || helper.id}</Text>
          {helper.admin_only && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
          <Image 
            source={require('../assets/icons/info.png')} 
            style={styles.infoIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Description */}
      {helper.description && (
        <Text style={styles.description} numberOfLines={2}>
          {helper.description}
        </Text>
      )}

      {/* Admin Configuration Required */}
      {helper.admin_activation_required && (
        <View style={styles.adminConfigContainer}>
          <Text style={styles.adminConfigText}>⚠️ Needs admin configuration</Text>
        </View>
      )}

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, helper.enabled ? styles.enabledDot : styles.disabledDot]} />
        <Text style={[styles.statusText, helper.enabled ? styles.enabledText : styles.disabledText]}>
          {helper.enabled ? 'Active' : 'Paused'}
        </Text>
      </View>

      {/* Schedule */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Schedule:</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {formatSchedule(helper.schedule)}
        </Text>
      </View>

      {/* Parameters */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Parameters:</Text>
        <Text style={styles.infoValue} numberOfLines={2}>
          {formatParameters(helper.params)}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.toggleButton,
            isToggling && styles.disabledButton
          ]} 
          onPress={handleToggle}
          disabled={isToggling}
        >
          {isToggling ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              {helper.enabled ? 'Pause' : 'Resume'}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.editButton,
            (isEditing || !hasConfigurableContent()) && styles.disabledButton
          ]} 
          onPress={handleEdit}
          disabled={isEditing || !hasConfigurableContent()}
        >
          {isEditing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[
              styles.actionButtonText,
              !hasConfigurableContent() && styles.disabledButtonText
            ]}>Edit</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.deleteButton,
            isDeleting && styles.disabledButton
          ]} 
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContainer}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>{helper?.name || helper?.id || 'Unknown Helper'}</Text>
              <TouchableOpacity 
                style={styles.infoModalCloseButton}
                onPress={() => setShowInfoModal(false)}
              >
                <Image 
                  source={require('../assets/icons/close.png')} 
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoModalContent}>
              {helper?.description && (
                <View style={styles.infoModalSection}>
                  <Text style={styles.infoModalSectionTitle}>Description</Text>
                  <Text style={styles.infoModalSectionText}>{helper.description}</Text>
                </View>
              )}
              
              <View style={styles.infoModalSection}>
                <Text style={styles.infoModalSectionTitle}>Status</Text>
                <View style={[styles.infoModalStatusBadge, { backgroundColor: helper?.enabled ? '#4CAF50' : '#FF9800' }]}>
                  <Text style={styles.infoModalStatusText}>
                    {helper?.enabled ? 'Active' : 'Paused'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoModalSection}>
                <Text style={styles.infoModalSectionTitle}>Schedule</Text>
                <Text style={styles.infoModalSectionText}>
                  {formatSchedule(helper?.schedule)}
                </Text>
              </View>
              
              <View style={styles.infoModalSection}>
                <Text style={styles.infoModalSectionTitle}>Parameters</Text>
                <Text style={styles.infoModalSectionText}>
                  {formatParameters(helper?.params)}
                </Text>
              </View>
              
              {helper?.require_admin_activation && (
                <View style={styles.infoModalSection}>
                  <Text style={styles.infoModalSectionTitle}>Admin Activation Required</Text>
                  <Text style={styles.infoModalSectionText}>
                    This helper requires admin approval to activate.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteModalHeader}>
              <Text style={styles.deleteModalTitle}>Delete Helper</Text>
              <TouchableOpacity 
                style={styles.deleteModalCloseButton}
                onPress={() => setShowActionModal(false)}
              >
                <Image 
                  source={require('../assets/icons/close.png')} 
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.deleteModalContent}>

              <Text style={styles.deleteModalDescriptionText}>
                Are you really sure you want to delete this helper?
              </Text>
            </View>

            <View style={styles.deleteModalActions}>
              <TouchableOpacity 
                style={styles.deleteModalCancelButton}
                onPress={() => setShowActionModal(false)}
                disabled={isDeleting}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteModalConfirmButton}
                onPress={confirmAction}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteModalConfirmText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <HelperEditModal
        visible={showEditModal}
        helper={helper}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
        isLoading={isEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1a1a',
    borderRadius: RFValue(12),
    padding: RFValue(15),
    marginBottom: RFValue(15),
    borderLeftWidth: RFValue(4),
  },
  enabledCard: {
    borderLeftColor: '#4CAF50',
  },
  disabledCard: {
    borderLeftColor: '#FF9800',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
    flex: 1,
  },
  adminBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(2),
    borderRadius: RFValue(4),
    marginLeft: RFValue(8),
  },
  adminBadgeText: {
    fontSize: RFValue(10),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
  },
  infoButton: {
    padding: RFValue(8),
    borderRadius: RFValue(20),
    backgroundColor: '#444',
    width: RFValue(32),
    height: RFValue(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    width: RFValue(16),
    height: RFValue(16),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(8),
  },
  statusDot: {
    width: RFValue(8),
    height: RFValue(8),
    borderRadius: RFValue(4),
    marginRight: RFValue(8),
  },
  enabledDot: {
    backgroundColor: '#4CAF50',
  },
  disabledDot: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
  },
  enabledText: {
    color: '#4CAF50',
  },
  disabledText: {
    color: '#FF9800',
  },
  infoRow: {
    marginBottom: RFValue(6),
  },
  infoLabel: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#a0a0a0',
    marginBottom: RFValue(2),
  },
  infoValue: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#e0e0e0',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(10),
  },
  actionButton: {
    flex: 1,
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(6),
    marginHorizontal: RFValue(2),
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  disabledButtonText: {
    color: '#888',
  },
  disabledButton: {
    opacity: 0.5,
  },
  description: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#b0b0b0',
    marginBottom: RFValue(8),
    lineHeight: RFValue(18),
  },
  adminConfigContainer: {
    backgroundColor: '#FF9800',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(4),
    marginBottom: RFValue(8),
    alignSelf: 'flex-start',
  },
  adminConfigText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  errorText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ff6b6b',
    marginTop: RFValue(8),
    textAlign: 'center',
  },
  // Info Modal Styles
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  infoModalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(16),
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  infoModalTitle: {
    fontSize: RFValue(20),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#fff',
    flex: 1,
  },
  infoModalCloseButton: {
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
  infoModalContent: {
    padding: RFValue(20),
  },
  infoModalSection: {
    marginBottom: RFValue(16),
  },
  infoModalSectionTitle: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
    marginBottom: RFValue(8),
  },
  infoModalSectionText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
    lineHeight: RFValue(20),
  },
  infoModalStatusBadge: {
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(6),
    borderRadius: RFValue(16),
    alignSelf: 'flex-start',
  },
  infoModalStatusText: {
    fontSize: RFValue(12),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },

  // Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
  },
  deleteModalContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(16),
    width: '100%',
    maxHeight: '60%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  deleteModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: RFValue(20),
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  deleteModalTitle: {
    fontSize: RFValue(20),
    fontFamily: 'RedHatDisplay_700Bold',
    color: '#ff6b6b',
    flex: 1,
  },
  deleteModalCloseButton: {
    width: RFValue(32),
    height: RFValue(32),
    borderRadius: RFValue(16),
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    padding: RFValue(20),
  },
  deleteModalWarningText: {
    fontSize: RFValue(16),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
    marginBottom: RFValue(12),
    textAlign: 'center',
  },
  deleteModalDescriptionText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_400Regular',
    color: '#ccc',
    lineHeight: RFValue(20),
    textAlign: 'auto',
  },
  deleteModalActions: {
    flexDirection: 'row',
    padding: RFValue(20),
    gap: RFValue(12),
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    backgroundColor: '#666',
    alignItems: 'center',
  },
  deleteModalCancelText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
  deleteModalConfirmButton: {
    flex: 1,
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    backgroundColor: '#f44336',
    alignItems: 'center',
  },
  deleteModalConfirmText: {
    fontSize: RFValue(14),
    fontFamily: 'RedHatDisplay_600SemiBold',
    color: '#fff',
  },
});

export default HelperCard;
