import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToUserUpdates, addOrSelectChat } from '../data/Actions'; 
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Button, Input, Icon } from '@rneui/themed';
import { getAuthUser } from '../AuthManager';
import { addCurrentChatMessage, fetchChatMessages } from '../data/Actions';

function AnnouncementsScreen({ navigation }) {
  const currentAuthUser = getAuthUser();
  const currentUserId = currentAuthUser.uid;
  const users = useSelector(state => state.auth.users);
  const currentChat = useSelector(state => state.reducer.currentChat);

  // const otherUserId = "MCgg9rgXKSOAcV5Iqi4JugNtQzu1"; 
  // Anna anna@yahoo.com password MCgg9rgXKSOAcV5Iqi4JugNtQzu1
  // Thomas thomas@yahoo.com password AD6o2UbKwSPszwrzaiBRZrtYKCZ2
  // console.log(`CURRENT ID: ${currentUserId}`)
  let otherUserId = ""
  if (currentUserId === "MCgg9rgXKSOAcV5Iqi4JugNtQzu1") {
    otherUserId = "AD6o2UbKwSPszwrzaiBRZrtYKCZ2"; 
  } else if (currentUserId === "AD6o2UbKwSPszwrzaiBRZrtYKCZ2") {
    otherUserId = "MCgg9rgXKSOAcV5Iqi4JugNtQzu1"; 
  }

  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribeToUserUpdates());
    dispatch(addOrSelectChat(currentUserId, otherUserId));
    if (currentChat?.id) {
      dispatch(fetchChatMessages(currentChat.id));
    }
  }, [dispatch, currentUserId, otherUserId, currentChat?.id]); 

  const messages = currentChat?.messages ?? [];

  const handleSendMessage = () => {
    const newMessage = {
      author: currentUserId, 
      message: inputText,
      timestamp: new Date().toISOString(),  
    };
    dispatch(addCurrentChatMessage(newMessage));
    setInputText(''); 
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={styles.headerText}>Chat with ClubHouse</Text>
          </View>
        </View>

        <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {messages
            .map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.author === currentUserId ? styles.self : styles.other,
                ]}
              >
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            ))}
        </ScrollView>
        </View>

        <View style={styles.footer}>
          <Input
            containerStyle={styles.inputBox}
            placeholder="Enter chat message"
            value={inputText}
            onChangeText={text => setInputText(text)}
          />
          <Button
            buttonStyle={styles.sendButton}
            onPress={handleSendMessage}  
          >
            <Icon name="send" size={32} color="#386641" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F2E8CF',
  },
  header: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    padding: '3%',
  },
  headerText: {
    fontSize: 20,
  },
  headerLeft: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 0.6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  body: {
    flex: 0.8,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    padding: '3%',
  },
  scrollContainer: {
    flex: 1.0,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    padding: '3%',
  },
  messageBubble: {
    borderRadius: 6,
    padding: '2%',
    margin: '2%',
  },
  messageText: {
    fontSize: 18,
    color: "white",
  },
  self: {
    alignSelf: 'flex-end',
    backgroundColor: '#386641',
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: 'black',
  },
  footer: {
    flex: 0.1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '3%',
  },
  inputBox: {
    width: '80%',
  },
  sendButton: {
    backgroundColor: 'white',
  },
});

export default AnnouncementsScreen;
