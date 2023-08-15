import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'; // Replaced Animated with Image
import LanguageChart from './LanguageChart';

const UserProfile = ({ userData, languageStats, navigation }) => {

  const handleBack = () => {
    navigation.navigate('InitialScreen'); // Navigate to InitialScreen
  };

  return (
    <View style={{ backgroundColor: '#0D1117', flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>&lt;&lt;</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Image source={{ uri: userData.avatar_url }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{typeof userData.login === 'string' ? userData.login : 'Default Value'}</Text>
        </View>
      </View>
      <Text style={styles.bio}>{userData.bio}</Text>
      <View>
        {/* Use userData and languageStats as needed */}
        <LanguageChart languageStats={languageStats} />
        {/* Other Components */}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 30,
    marginTop: 5,
    padding: 10,
    backgroundColor: '#e4e4e4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  username: {
    fontSize: 26,
    color: '#0D1117',
  },
  backButton: {
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 36,
  },
  bio: {
    color: '#e4e4e4',
    margin: 25,
    marginTop: 0,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default UserProfile;
