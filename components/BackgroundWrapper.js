import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'react-native';

const BackgroundWrapper = ({ children }) => {
  const backgroundColor = '#211e1e'; 

  return (
    <View style={[styles.container, { backgroundColor }]}>
      
      {children}
      <StatusBar backgroundColor={backgroundColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BackgroundWrapper;
