import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getLoopsThunk } from '../data/listSlice';  
import { getAuthUser } from '../AuthManager';  

function DirectoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const loops = useSelector(state => state.list?.loops || []);  
  const [uniqueNames, setUniqueNames] = useState([]);
  const authUser = getAuthUser(); 
  
  useEffect(() => {
    if (authUser) {
      dispatch(getLoopsThunk(authUser.uid)); 
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (loops.length > 0) {
      const userLoops = loops.filter(loop => loop.userId === authUser.uid);  
      const names = [...new Set(userLoops.map(loop => loop.name))];  
      setUniqueNames(names);
    }
  }, [loops, authUser.uid]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Directory</Text>
      <FlatList
        style={styles.item}
        data={uniqueNames}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.nameItem}
            onPress={() => {
              navigation.navigate('Profile', { name: item });
            }}
          >
            <Text style={styles.nameText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F2E8CF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    width: '100%',
    padding: "2%",
  },
  nameItem: {
    borderWidth: 1,
    borderColor: '#386641',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#386641',
    alignItems: 'center',
    padding: "5%",
  },
  nameText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});

export default DirectoryScreen;
