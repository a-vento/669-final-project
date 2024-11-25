import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getLoopsThunk } from '../features/listSlice';
import { getAuthUser, signOut } from '../AuthManager';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { subscribeToUserUpdates } from '../features/authSlice';

function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const loops = useSelector(state => state.list?.loops || []);
  const [averageAmount, setAverageAmount] = useState(0);
  const [topFrequentNames, setTopFrequentNames] = useState([]);
  const [totalLoopCount, setTotalLoopCount] = useState(0);
  const [averageLoopPay, setAverageLoopPay] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear()); 

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [editedName, setEditedName] = useState(getAuthUser().displayName);
  const [editedRank, setEditedRank] = useState('');
  const [editedCourse, setEditedCourse] = useState('');
  const [tempName, setTempName] = useState(editedName);
  const [tempRank, setTempRank] = useState(editedRank);
  const [tempCourse, setTempCourse] = useState(editedCourse);

  const authUser = getAuthUser();
  const db = getFirestore();

  useEffect(() => {
    dispatch(subscribeToUserUpdates());
  }, []);

  useEffect(() => {
    dispatch(getLoopsThunk(authUser.uid)); 
  }, [dispatch, authUser.uid]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setEditedRank(userData.rank || '');
          setEditedCourse(userData.course || '');  
        }
      }
    };

    fetchUserData();

    const unsubscribe = onSnapshot(doc(db, 'users', authUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setEditedName(userData.displayName || ''); 
        setEditedRank(userData.rank || '');
        setEditedCourse(userData.course || '');
      }
    });

    return () => unsubscribe();
  }, [authUser, db]);

  useEffect(() => {
    if (isOverlayVisible) {
      setTempName(editedName);
      setTempRank(editedRank);
      setTempCourse(editedCourse);
    }
  }, [isOverlayVisible, editedName, editedRank, editedCourse]);

  useEffect(() => {
    if (loops.length > 0) {
      const userLoops = loops.filter(loop => loop.userId === authUser.uid); 
      const filteredLoops = userLoops.filter(loop => new Date(loop.date).getFullYear() === year);

      const totalAmount = filteredLoops.reduce((sum, loop) => sum + loop.amount, 0);
      const avgAmount = totalAmount / filteredLoops.length || 0;
      setAverageAmount(avgAmount);

      const totalCount = filteredLoops.length;
      setTotalLoopCount(totalCount);

      const avgLoopPay = totalAmount / totalCount || 0;
      setAverageLoopPay(avgLoopPay);

      const nameFrequency = {};
      filteredLoops.forEach(loop => {
        nameFrequency[loop.name] = (nameFrequency[loop.name] || 0) + 1;
      });

      const sortedNames = Object.entries(nameFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      setTopFrequentNames(sortedNames);
    }
  }, [loops, year, authUser.uid]);

  const handleSaveChanges = async () => {
    try {
      const userRef = doc(db, 'users', authUser.uid);
      await setDoc(userRef, { 
        displayName: tempName, 
        rank: tempRank, 
        course: tempCourse 
      }, { merge: true });
      setEditedName(tempName);
      setEditedRank(tempRank);
      setEditedCourse(tempCourse);
      setIsOverlayVisible(false); 
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleCancelChanges = () => {
    setIsOverlayVisible(false); 
  };

  const handleSignOut = async () => {
    const auth = getAuthUser();
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleYearChange = (increment) => {
    setYear(prevYear => prevYear + increment);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>Name: {editedName}</Text>
        <Text style={styles.title}>Rank: {editedRank || 'N/A'}</Text>
        <Text style={styles.title}>Home Course: {editedCourse || 'N/A'}</Text>
        <SimpleLineIcons 
          name="pencil" 
          size={24} 
          color="black" 
          onPress={() => setIsOverlayVisible(true)} 
          style={styles.pencilIcon}
        />
      </View>
      {isOverlayVisible && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter new name"
            />

            <TextInput
              style={styles.input}
              value={tempRank}
              onChangeText={setTempRank}
              placeholder="Enter rank"
            />

            <TextInput
              style={styles.input}
              value={tempCourse}
              onChangeText={setTempCourse}
              placeholder="Enter home course"
            />

            <Button title="Save" onPress={handleSaveChanges} />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={handleCancelChanges} />
              <Button title="Sign Out" onPress={handleSignOut} />
            </View>
          </View>
        </View>
      )}
      <View style={styles.filtersContainer}>
        <AntDesign 
          name="arrowleft" 
          size={24} 
          color="black" 
          onPress={() => handleYearChange(-1)} 
        />
        <Text style={styles.yearText}>{year}</Text>
        <AntDesign 
          name="arrowright" 
          size={24} 
          color="black" 
          onPress={() => handleYearChange(1)} 
        />
      </View>
      <View style={styles.metricsContainer}>
        {loops.length === 0 ? (
          <Text>No loops available to calculate metrics.</Text>
        ) : (
          <>
            <View style={styles.metricCard}>
              <Text style={styles.metricText}>Average Amount:</Text>
              <Text style={styles.dataText}>${averageAmount.toFixed(2)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricText}>Total Loop Count:</Text>
              <Text style={styles.dataText}>{totalLoopCount}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricText}>Average Loop Pay:</Text>
              <Text style={styles.dataText}>${averageLoopPay.toFixed(2)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricText}>Top 3 Most Frequent Players:</Text>
              <View style={styles.listCard}>
                {topFrequentNames.length > 0 ? (
                  topFrequentNames.map(([name, count], index) => (
                    <Text key={index} style={styles.dataListText}>
                      {name} : {count} loops
                    </Text>
                  ))
                ) : (
                  <Text style={styles.metricText}>N/A</Text>
                )}
              </View>
            </View>
          </>
        )}
      </View>
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
  profileCard: {
    backgroundColor: '#386641',
    padding: 30,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    position: 'relative',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 2,
    flexWrap: 'wrap',
    width: '100%',
    right: 10,
    color: '#F2E8CF',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  metricCard: {
    backgroundColor: '#386641',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  listCard: {
    marginTop: 20,
    marginBottom: 50,
  },
  metricText: {
    width: '100%',
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
  },
  dataText: {
    marginTop: 50,
    marginBottom: 50,
    width: '100%',
    fontSize: 27,
    color: '#F2E8CF',
    textAlign: 'center',
  },
  dataListText: {
    width: '100%',
    fontSize: 15,
    color: '#F2E8CF',
    textAlign: 'left',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  filtersContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearText: {
    fontSize: 20,
    color: 'black',
    marginHorizontal: 10,
  },
  pencilIcon: {
    position: 'absolute',
    right: 20,
    bottom: 10,
  },
});

export default HomeScreen;
