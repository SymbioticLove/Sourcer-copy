import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

const LanguageChart = ({ languageStats: initialLanguageStats }) => {
  const [languageStats, setLanguageStats] = useState([]);

  const languageColors = {
    HTML: '#E44D26',
    CSS: '#264DE4',
    JavaScript: '#F0DB4F',
    Python: '#3572A5',
    Ruby: '#701516',
    Shell: '#4EAA25',
    C: '#A8B9CC',
    CPlusPlus: '#F34B7D',
    CSharp: '#178600',
    Java: '#B07219',
    Kotlin: '#F18E33',
    Swift: '#FFAC45',
    TypeScript: '#2B7489',
    ObjectiveC: '#438EFF',
    PHP: '#777BB4',
    R: '#276DC3',
    SQL: '#E34C26',
    Go: '#00ADD8',
    MATLAB: '#BB92AC',
    Perl: '#0298C3',
    Rust: '#B7410E',
    Scala: '#C22D40',
    Lua: '#000080',
    Groovy: '#E69F56',
    Dart: '#00B4AB',
    Haskell: '#5D4DB6',
    CoffeeScript: '#244776',
    VimScript: '#199F4B',
    // Add more languages and colors as needed
  };  

  useEffect(() => {
    // Formatting the language stats
    const formattedStats = Object.keys(initialLanguageStats).map(language => ({
      key: language,
      value: initialLanguageStats[language],
    }));
    setLanguageStats(formattedStats);
  }, [initialLanguageStats]);

  // Determine the total bytes to calculate a percentage threshold
  const totalBytes = languageStats.reduce((total, entry) => total + entry.value, 0);
  const threshold = totalBytes * 0.01; // 1% of total bytes as threshold

  // Filter the languageStats to only include entries greater than the threshold
  const filteredLanguageStats = languageStats.filter(entry => entry.value > threshold);

  const pieData = filteredLanguageStats.map((entry) => ({
    key: entry.key,
    value: entry.value,
    svg: {
      fill: languageColors[entry.key] || '#fff',
      stroke: '#ffffff',
      strokeWidth: 0.2,
    },
  }));
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.keyContainer}>
        {filteredLanguageStats.map((entry, index) => (
          <View key={index} style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: languageColors[entry.key] || '#fff' }]} />
            <Text style={styles.keyText}>{entry.key}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pieChartContainer}>
        <PieChart style={styles.pieChart} data={pieData} />
        <View style={styles.centerLabelContainer}>
          <Text style={styles.centerLabelText}>
            {totalBytes.toLocaleString()} bytes
          </Text>
          {/* Using toLocaleString to add commas */}
        </View>
      </View>
    </View>
  );  
}; 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  keyContainer: {
    flex: 1,
    paddingRight: 10,
  },
  keyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  keyText: {
    fontSize: 16,
    color: '#e4e4e4',
  },
  pieChart: {
    height: 300,
    width: '100%',
  },
  pieChartContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e4e4e4',
  },
});

export default LanguageChart;
