import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen'; 
import DirectoryScreen from './screens/DirectoryScreen'; 
import AnnouncementsScreen from './screens/AnnouncementsScreen.js'; 
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import listReducer from './features/listSlice';
import Header from './components/Header.js';
import IntroScreen from './screens/IntroScreen'; 
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { rootReducer } from './data/Reducer';
import authReducer from './features/authSlice'; 

const store = configureStore({
  reducer: {
    list: listReducer,
    reducer: rootReducer, 
    auth: authReducer,
  },
});

function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function HomeTabs() {
    return (
      <Tab.Navigator screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: '#F2E8CF',
          borderTopWidth: 1,
          borderTopColor: '#386641',
          paddingBottom: 5, 
        },
        tabBarActiveTintColor: '#F9A03F', 
        tabBarInactiveTintColor: '#000000', 
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
        <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={size} />
          ),
        }} 
        />
        <Tab.Screen name="List" component={ListScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="list-ul" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Directory" component={DirectoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size}  />
          ),
        }} />
        <Tab.Screen name="Announcements" component={AnnouncementsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size}/>
          ),
        }} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro">
          <Stack.Screen 
            name="Intro" 
            component={IntroScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="HomeTabs" 
            component={HomeTabs} 
            options={{
              header: () => <Header title="Caddy Hack" />, 
            }} 
          />
          <Stack.Screen name="List" component={ListScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
