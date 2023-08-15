import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import GitHubToken from '../Header';

const InitialScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async () => {
    setLoading(true);
    setError(null);
  
    const trimmedUsername = username.trim();
    const isValidUsername = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(trimmedUsername);
  
    if (!isValidUsername) {
      setLoading(false);
      setError("Invalid GitHub Username");
      return;
    }
  
    try {
      const response = await fetch(`https://api.github.com/users/${trimmedUsername}`, {
        headers: {
          Authorization: `Bearer ${ GitHubToken }`,
        },
      });
      const userData = await response.json();
  
      const reposResponse = await fetch(`https://api.github.com/users/${trimmedUsername}/repos`);
      const repos = await reposResponse.json();
      const stats = {};
      for (const repo of repos) {
        const languagesResponse = await fetch(repo.languages_url);
        const languages = await languagesResponse.json();
        for (const [language, bytes] of Object.entries(languages)) {
          stats[language] = (stats[language] || 0) + bytes;
        }
      }
  
      if (response.ok) {
        setLoading(false);
        navigation.navigate('DataDisplay', { userData, languageStats: stats });
      } else {
        throw new Error("No Matching GitHub Account Found");
      }      
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error.message);
    }
  };    

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter GitHub username"
        placeholderTextColor="#A9A9A9"
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleLookup}>
        <Text style={styles.buttonText}>Look Up</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator color="#FFFFFF" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: 150,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#0D1117',
  },
});

export default InitialScreen;
