import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import UserProfile from './UserProfile';

const DataDisplay = ({ route, navigation }) => {
  const { userData, languageStats } = route.params;

  return (
    <ScrollView style={styles.container}>
      <UserProfile userData={userData} languageStats={languageStats} navigation={navigation} />
      <Text style={styles.text}>{JSON.stringify({ userData, languageStats }, null, 2)}</Text>
    </ScrollView>
  );
};

export default DataDisplay;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
  },
  text: {
    color: '#e4e4e4',
  }
});
