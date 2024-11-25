import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

const IntroScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
          source={require('../images/golfBag.png')} 
          style={styles.image}
      />
      <Text style={styles.title}>Caddy Hack</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#386641",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: "#F2E8CF",
  },
  image: {
    width: 200,   
    height: 200,
  },
  button: {
    backgroundColor: "#F2E8CF",   
    paddingVertical: 15,          
    paddingHorizontal: 30,        
    borderRadius: 50,              
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,            
    width: "60%",
  },
  buttonText: {
    fontSize: 20,
  },
});

export default IntroScreen;
