import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addLoopThunk, removeLoopThunk, updateLoopThunk, getLoopsThunk } from '../features/listSlice'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getAuthUser } from '../AuthManager';

function ListScreen() {
  const [playerName, setPlayerName] = useState('');
  const [loopAmount, setLoopAmount] = useState('');
  const [loopDate, setLoopDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amountCondition, setAmountCondition] = useState('greater');
  const [amountValue, setAmountValue] = useState('');

  const loops = useSelector(state => state.list?.loops || []);
  const dispatch = useDispatch();
  const authUser = getAuthUser(); 

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setLoopDate(today);

    if (authUser) {
      dispatch(getLoopsThunk(authUser.uid));
    }
  }, [authUser, dispatch]);

  const handleAddLoop = () => {
    if (playerName.trim() && loopAmount.trim()) {
      const amount = parseFloat(loopAmount);  
      dispatch(addLoopThunk({ name: playerName, amount, date: loopDate, userId: authUser.uid })); 
      setPlayerName('');
      setLoopAmount('');
      setLoopDate(new Date().toISOString().split('T')[0]); 
    }
  };

  const handleRemoveLoop = (loop) => {
    dispatch(removeLoopThunk(loop)); 
  };

  const handleUpdateLoop = (id) => {

  };

  const filteredLoops = loops.filter((loop) => {
    if (loop.userId !== authUser.uid) return false;

    const nameMatch = loop.name.toLowerCase().includes(searchQuery.toLowerCase());
  
    let amountMatch = true;
    if (amountValue) {
      const amountConditionMatch = parseFloat(amountValue);
      if (amountCondition === 'greater') {
        amountMatch = loop.amount > amountConditionMatch;
      } else if (amountCondition === 'less') {
        amountMatch = loop.amount < amountConditionMatch;
      } else if (amountCondition === 'equal') {
        amountMatch = loop.amount === amountConditionMatch;
      }
    }
    let dateMatch = true;
    if (startDate && new Date(loop.date) < new Date(startDate)) {
      dateMatch = false;
    }
    if (endDate && new Date(loop.date) > new Date(endDate)) {
      dateMatch = false;
    }

    return nameMatch && amountMatch && dateMatch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.loopInput}>
        <TextInput
          style={styles.input}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Player Name"
        />
        <TextInput
          style={styles.input}
          value={loopAmount}
          onChangeText={setLoopAmount}
          placeholder="Payment"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={loopDate}
          onChangeText={setLoopDate} 
          maxLength={10} 
        />
      </View>
      <TouchableOpacity
        onPress={handleAddLoop} 
        style={styles.addButton} 
      >
        <Ionicons name="add-circle" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>History</Text>
      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Player name"
        />
        <AntDesign 
          name="filter" 
          size={24} 
          color="black" 
          onPress={() => setFilterVisible(true)} 
          style={styles.filterIcon}
        />
      </View>
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>Filter Loops</Text>
            <View style={styles.filterDates}>
              <TextInput
                style={styles.filterInput}
                placeholder="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChangeText={setStartDate}
              />
              <TextInput
                style={styles.filterInput}
                placeholder="End Date (YYYY-MM-DD)"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
              <TextInput
                style={styles.filterInput}
                placeholder="Amount"
                value={amountValue}
                onChangeText={setAmountValue}
                keyboardType="numeric"
              />
            
            <View style={styles.amountConditions}>
              <TouchableOpacity onPress={() => setAmountCondition('greater')} style={[styles.conditionButton, amountCondition === 'greater' && styles.selectedCondition]}>
                <Text style={styles.conditionText}>Greater than</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAmountCondition('less')} style={[styles.conditionButton, amountCondition === 'less' && styles.selectedCondition]}>
                <Text style={styles.conditionText}>Less than</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAmountCondition('equal')} style={[styles.conditionButton, amountCondition === 'equal' && styles.selectedCondition]}>
                <Text style={styles.conditionText}>Equal to</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.overlayButtons}>
              <Button title="Done" onPress={() => setFilterVisible(false)} />
              <Button title="Clear" onPress={() => {
                setStartDate('');
                setEndDate('');
                setAmountCondition('greater');
                setAmountValue('');
                setFilterVisible(false);
              }} />
            </View>
          </View>
        </View>
      </Modal>
      {filteredLoops.length > 0 ? (
        <FlatList
          data={filteredLoops}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{`${new Date(item.date).toLocaleDateString()}`}</Text>
              <Text>{item.name}</Text>
              <Text>{`$${item.amount.toFixed(2)}`}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => handleRemoveLoop(item)}
                  style={styles.button} 
                >
                  <FontAwesome name="trash-o" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleUpdateLoop(item.id)}
                  style={styles.button} 
                >
                  <FontAwesome name="pencil-square-o" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text>No loops available</Text>
      )}
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
    marginBottom: 10,
  },
  loopInput: {
    flexDirection: 'row',  
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
    width: '30%',
  },
  filterInput: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
    width: '50%',
  },
  filters: {
    flexDirection: 'row',  
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
  },
  filterIcon: {
    paddingBottom: 15,
    marginLeft: 20,
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
  amountConditions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  conditionButton: {
    padding: 10,
    backgroundColor: '#CCC',
    borderRadius: 5,
  },
  selectedCondition: {
    backgroundColor: '#386641',
  },
  conditionText: {
    color: '#FFF',
  },
  overlayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  filterDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  listItem: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10, 
  },
  addButton: {
    paddingBottom: 50,
  },
  button: {
    padding: 10,
  },
});

export default ListScreen;
