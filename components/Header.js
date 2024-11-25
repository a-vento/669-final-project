import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '../AuthManager'; 

const Header = ({ title }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('Intro');
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* <Button title="Profile" onPress={handleLogout} /> */}
      <Text style={styles.headerTitle}>{title}</Text>
      {/* <Button title="Logout" onPress={handleLogout} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 80,
    backgroundColor: '#F2E8CF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Header;
