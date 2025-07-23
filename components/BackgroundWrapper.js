import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'react-native';

const BackgroundWrapper = ({ children }) => {
  const backgroundColor = '#211e1e'; 

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[styles.container, { backgroundColor }]}>
      {children}
      <StatusBar backgroundColor={backgroundColor} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BackgroundWrapper;
