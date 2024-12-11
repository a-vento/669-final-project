import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

function ProfileScreen({ route, navigation }) { 
  const { name } = route.params;  
  const loops = useSelector(state => state.list?.loops || []); 
  const [averageAmount, setAverageAmount] = useState(0);
  const [totalLoops, setTotalLoops] = useState(0);
  const [playerNotes, setPlayerNotes] = useState([]); 

  useEffect(() => {
    if (loops.length > 0) {
      const filteredLoops = loops.filter(loop => loop.name === name);
      const totalAmount = filteredLoops.reduce((sum, loop) => sum + loop.amount, 0);
      const avgAmount = totalAmount / filteredLoops.length;

      setAverageAmount(avgAmount);  
      setPlayerNotes(filteredLoops.map(loop => loop.notes)); 
    }
  }, [loops, name]);

  useEffect(() => {
    if (loops.length > 0) {
        const filteredLoops = loops.filter(loop => loop.name === name);
        setTotalLoops(filteredLoops.length);  
    }
  }, [loops, name]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} 
      >
        <Text style={styles.backButtonText}> {`\<`} Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{name}'s Profile</Text>
        <Text style={styles.metric}>Average Amount: ${averageAmount.toFixed(2)}</Text>
        <Text style={styles.metric}>Total Rounds: {totalLoops}</Text>
      

        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes History:</Text>
          {playerNotes.filter(item => typeof item === 'string' && item.trim() !== "").length > 0 ? (
            <FlatList
              data={playerNotes.filter(item => typeof item === 'string' && item.trim() !== "")} 
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <Text style={styles.noteText}>{item}</Text>
                </View>
              )}
            />
          ) : (
            <Text>No notes available for this player.</Text> 
          )}
        </View>

    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2E8CF',
  },
  backButton: {
    marginTop: 100,
    left: 0, 
  },
  backButtonText: {
    fontSize: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#386641',
    borderRadius: 5,
    alignItems: 'center',
    paddingTop: "15%",
    paddingBottom: "25%",
    paddingLeft: "15%",
    paddingRight: "15%",
    marginBottom: 120,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center', 
    width: "100%",
    paddingBottom: "15%",
  },
  metric: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'left', 
    width: "100%",  
  },
  notesContainer: {
    paddingTop: 20,
    width: '100%',
  },
  notesTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  noteItem: {
    padding: 10,
    marginLeft: 20,
  },
  noteText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default ProfileScreen;
