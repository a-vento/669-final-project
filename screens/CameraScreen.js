import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {setPicture} from "../data/userSlice";
import { getAuthUser } from '../AuthManager';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



import {subscribeToUserOnSnapshot} from "../data/userSlice";
import {useEffect, useState } from "react";

let currentUserId;
let theCamera = undefined;
function CameraScreen({navigation}) {
    const currentUser = useSelector(state => state.userSlice.currentUser);
    const gallery = currentUser.gallery;
    
    useEffect(() => {
        if (currentUser?.key && currentUser.key !== currentUserId) {
        currentUserId = currentUser.key
        subscribeToUserOnSnapshot(currentUser.key, dispatch)
        }
    }, [currentUser]);

  const dispatch = useDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ratio='4:3'
          pictureSize='Medium'
          facing='back'
          ref={ref => theCamera = ref}
        >
        </CameraView>
        <TouchableOpacity
                style={styles.button}
                onPress={async() => {
                    const photo = await theCamera.takePictureAsync({quality: 0.1});
                    dispatch(setPicture(photo));
                  }}
            >
                <MaterialIcons name="camera" size={50} color="green" />
             </TouchableOpacity>
      </View>

      <Text style={{padding:'5%'}}>
        {currentUser?.displayName}'s Gallery:
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={gallery}
          keyExtractor={item=>item.uri}
          renderItem={({item}) => {
            return (
              <View>
                <Image
                  style={styles.logo}
                  source={item}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  camera: {
    flex: 0.85,
    height: '100%',
    width: '100%',
  },
  listContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%' 
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;