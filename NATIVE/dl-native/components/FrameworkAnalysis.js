import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import GitHubToken from '../Header';

const FrameworksAnalysis = ({ trimmedUsername }) => {
  const [jsFrameworks, setJsFrameworks] = useState(null);
  const [pythonFrameworks, setPythonFrameworks] = useState(null);

  const decodeBase64 = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = '';
    let i = 0;
  
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  
    while (i < input.length) {
      const enc1 = chars.indexOf(input.charAt(i++));
      const enc2 = chars.indexOf(input.charAt(i++));
      const enc3 = chars.indexOf(input.charAt(i++));
      const enc4 = chars.indexOf(input.charAt(i++));
  
      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;
  
      str += String.fromCharCode(chr1);
      if (enc3 !== 64) str += String.fromCharCode(chr2);
      if (enc4 !== 64) str += String.fromCharCode(chr3);
    }
  
    return str;
  };    

  useEffect(() => {
    const analyzeJavaScriptFrameworks = async () => {
      console.log("Fetching repositories for:", trimmedUsername);
    
      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${trimmedUsername}/repos`, {
        headers: {
          Authorization: `Bearer ${ GitHubToken }`,
        },
      });
      const repos = await reposResponse.json();
      console.log("Fetched repositories:", repos);
    
      // Filter JavaScript repositories
      const jsRepos = repos.filter(repo => repo.language === 'JavaScript');
      console.log("JavaScript repositories:", jsRepos);
    
      // Define known frameworks
      const frameworkStats = {};

      // Use a Promise race to cap the analysis time
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds
      const analysisPromise = (async () => {
        for (const repo of jsRepos) {
          // Analyze root package.json
          const rootPackageJsonFound = await analyzePackageJson(repo, `https://api.github.com/repos/${trimmedUsername}/${repo.name}/contents/package.json`, frameworkStats);
        
          if (rootPackageJsonFound) continue; // Skip to the next repo if package.json found in root
        
          // Analyze subdirectories (first layer)
          const subPackageJsonFound = await analyzeSubdirectories(repo, `https://api.github.com/repos/${trimmedUsername}/${repo.name}/contents`, frameworkStats);
        
          if (subPackageJsonFound) continue; // Skip to the next repo if package.json found in subdirectories
        }      
      })();

      // Wait for either the analysis to complete or the timeout to occur
      await Promise.race([analysisPromise, timeoutPromise]);
      
      // Extract top 3 frameworks
      const topFrameworks = Object.entries(frameworkStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([framework]) => framework);
    
      console.log("Top frameworks:", topFrameworks);
    
      // Update state
      setJsFrameworks(topFrameworks);
    };
    
    const analyzeSubdirectories = async (repo, url, frameworkStats, depth = 0) => {
      try {
        console.log("Analyzing subdirectories for repo:", repo.name, "URL:", url, "Depth:", depth); // Logging
        const dirsResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ GitHubToken }`,
          },
        });
        if (!dirsResponse.ok) {
          console.log("Failed to fetch directories for repo:", repo.name, "URL:", url); // Logging
          return false;
        }
        const dirs = await dirsResponse.json();
    
        // Directories to skip
        const skipDirs = ['lib', 'node_modules', 'env'];
    
        // Analyze package.json in subdirectories
        for (const dir of dirs.filter(dir => dir.type === 'dir')) {
          console.log("Analyzing directory:", dir.path, "for repo:", repo.name); // Logging directory name
          if (skipDirs.includes(dir.path.toLowerCase().split('/').pop())) {
            console.log("Skipping directory:", dir.path, "for repo:", repo.name); // Logging skip
            continue; // Skip this directory
          }
          const subdirUrl = `https://api.github.com/repos/${trimmedUsername}/${repo.name}/contents/${dir.path}`;
          const subdirPackageJsonUrl = `${subdirUrl}/package.json`;
    
          // Analyze package.json in current directory
          const packageJsonFound = await analyzePackageJson(repo, subdirPackageJsonUrl, frameworkStats);
    
          if (packageJsonFound) return true; // Return true if package.json found
    
          // Analyze subdirectories (up to the fifth layer) only if package.json not found
          if (depth < 4) {
            const foundInSubdir = await analyzeSubdirectories(repo, subdirUrl, frameworkStats, depth + 1);
            if (foundInSubdir) return true; // Return true if found in subdirectory
          }
        }
      } catch (error) {
        console.error("Error analyzing subdirectories for repo:", repo.name, "URL:", url, "Error:", error); // Logging
      }
      return false; // Return false if not found
    };                 
    
    const analyzePackageJson = async (repo, packageJsonUrl, frameworkStats) => {
      const knownFrameworks = ['react', 'angular', 'vue', 'redux', 'react-native', 'axios', 'express', 'jade', 'graphql', 'cors', 'uuid', 'clsx', 'morgan', 'router-dom'];
      const response = await fetch(packageJsonUrl, {
        headers: {
          Authorization: `Bearer ${ GitHubToken }`,
        },
      });
      if (!response.ok) return false;
    
      const packageJson = await response.json();
      const content = decodeBase64(packageJson.content);
      const dependencies = JSON.parse(content).dependencies || {};
      console.log(`Package.json found for ${repo.name}!`);
      console.log("Dependencies for repo:", repo.name, dependencies);
    
      // Check for known frameworks
      for (const framework of knownFrameworks) {
        if (dependencies[framework]) {
          frameworkStats[framework] = (frameworkStats[framework] || 0) + 1;
        }
      }
      return true;
    };       
    
    const analyzePythonFrameworks = async () => {
      console.log("Fetching Python repositories for:", trimmedUsername);
      const reposResponse = await fetch(`https://api.github.com/users/${trimmedUsername}/repos`, {
        headers: {
          Authorization: `Bearer ${ GitHubToken }`,
        },
      });
      const repos = await reposResponse.json();
      const pythonRepos = repos.filter(repo => repo.language === 'Python');
    
      // Define known frameworks
      const knownFrameworks = ['flask', 'django', 'tornado', 'beautifulsoup4', 'tk'];
      const frameworkStats = {};
    
      for (const repo of pythonRepos) {
        const requirementsUrl = `https://api.github.com/repos/${trimmedUsername}/${repo.name}/contents/requirements.txt`;
        const response = await fetch(requirementsUrl, {
          headers: {
            Authorization: `Bearer ${ GitHubToken }`,
          },
        });
        if (!response.ok) continue;
    
        const requirementsFile = await response.json();
        const content = decodeBase64(requirementsFile.content);
        const requirements = content.split('\n');
    
        for (const requirement of requirements) {
          const framework = requirement.split('==')[0];
          if (knownFrameworks.includes(framework)) { // Check if the framework is in the known list
            frameworkStats[framework] = (frameworkStats[framework] || 0) + 1;
          }
        }
      }
    
      const topFrameworks = Object.entries(frameworkStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([framework]) => framework);
    
      setPythonFrameworks(topFrameworks); // Update state
    };

    analyzeJavaScriptFrameworks();
    analyzePythonFrameworks();
  }, [trimmedUsername]);

  return (
    <View>
      <Text style={styles.topText}>Top JavaScript Frameworks/Libraries:</Text>
      {jsFrameworks ? (
        jsFrameworks.map((framework, index) => <Text key={index} style={styles.topJS}>{framework}</Text>)
      ) : (
        <Text style={styles.topText}>Loading...</Text>
      )}
      <Text style={styles.topText}>Top Python Frameworks/Libraries:</Text>
      {pythonFrameworks ? (
        pythonFrameworks.map((framework, index) => <Text key={index} style={styles.topPY}>{framework}</Text>)
      ) : (
        <Text style={styles.topText}>Loading...</Text>
      )}
    </View>
  );  
};

export default FrameworksAnalysis;

const styles = StyleSheet.create({ 
  topText: {
    color: '#e4e4e4',
    fontSize: 20,
  },
  topJS: {
    color: '#F0DB4F',
    fontSize: 16,
  },
  topPY: {
    color: '#3572A5',
    fontSize: 16,
  }
});
