import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatMultipleSchedules } from './CronFormatter';

// Get all available helpers
async function getAvailableHelpers() {
  const authToken = await AsyncStorage.getItem('authToken');
  if (!authToken) return [];

  try {
    const response = await axios.get(`${API_URL}/v2/helpers`, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    return response.data.helpers || [];
  } catch (error) {
    console.log('Error fetching available helpers:', error);
    return [];
  }
}

// Register a new helper
async function registerHelper(helperId, params, schedule = []) {
  const authToken = await AsyncStorage.getItem('authToken');
  if (!authToken) return { success: false, error: 'no_auth_token' };

  try {
    const response = await axios.post(`${API_URL}/v2/helpers`, {
      id: helperId,
      params: params,
      schedule: schedule
    }, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    return { success: true, helper: response.data.helper };
  } catch (error) {
    console.log('Error registering helper:', error);
    return { 
      success: false, 
      error: error.response?.data?.type || 'unknown_error',
      message: error.response?.data?.message || 'Failed to register helper'
    };
  }
}

// Update an existing helper
async function updateHelper(helperId, params, schedule = null, enabled = null) {
  const authToken = await AsyncStorage.getItem('authToken');
  if (!authToken) return { success: false, error: 'no_auth_token' };

  try {
    const updateData = { params };
    if (schedule !== null) updateData.schedule = schedule;
    if (enabled !== null) updateData.enabled = enabled;

    const response = await axios.put(`${API_URL}/v2/helpers/${helperId}`, updateData, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    return { success: true, helper: response.data.helper };
  } catch (error) {
    console.log('Error updating helper:', error);
    return { 
      success: false, 
      error: error.response?.data?.type || 'unknown_error',
      message: error.response?.data?.message || 'Failed to update helper'
    };
  }
}

// Unregister a helper
async function unregisterHelper(helperId) {
  const authToken = await AsyncStorage.getItem('authToken');
  if (!authToken) return { success: false, error: 'no_auth_token' };

  try {
    const response = await axios.delete(`${API_URL}/v2/helpers/${helperId}`, {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
    return { success: true };
  } catch (error) {
    console.log('Error unregistering helper:', error);
    return { 
      success: false, 
      error: error.response?.data?.type || 'unknown_error',
      message: error.response?.data?.message || 'Failed to unregister helper'
    };
  }
}

// Get user's active helpers from account data with full helper information
async function getUserActiveHelpers(userData) {
  if (!userData || !userData.services || !Array.isArray(userData.services)) {
    return [];
  }
  
  // Get all available helpers to cross-reference
  const availableHelpers = await getAvailableHelpers();
  const helpersMap = {};
  availableHelpers.forEach(helper => {
    helpersMap[helper.id] = helper;
  });
  
  // Filter helpers that are enabled or paused (not disabled) and merge with full data
  return userData.services
    .filter(service => 
      service && (service.enabled === true || service.enabled === false)
    )
    .map(service => {
      const fullHelperData = helpersMap[service.id] || {};
      return {
        ...fullHelperData, // Full helper data from /v2/helpers
        ...service, // User's specific configuration (params, schedule, enabled)
        // Ensure we have the user's specific data override the general data
        params: service.params,
        schedule: service.schedule,
        enabled: service.enabled
      };
    });
}

// Format schedule for display
function formatSchedule(schedule) {
  return formatMultipleSchedules(schedule);
}

// Format parameters for display
function formatParameters(params) {
  if (!params || Object.keys(params).length === 0) return 'No parameters';
  
  const paramStrings = Object.entries(params).map(([key, value]) => {
    if (typeof value === 'boolean') {
      return `${key}: ${value ? 'Yes' : 'No'}`;
    }
    return `${key}: ${value}`;
  });
  
  return paramStrings.join(', ');
}

export {
  getAvailableHelpers,
  registerHelper,
  updateHelper,
  unregisterHelper,
  getUserActiveHelpers,
  formatSchedule,
  formatParameters
};
