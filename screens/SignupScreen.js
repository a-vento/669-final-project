import { signUp } from "../AuthManager";
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { addUser } from "../features/authSlice";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

function SignupBox({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const dispatch = useDispatch();

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Sign Up</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Display Name: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter display name' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setDisplayName(text)}
            value={displayName}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter email address' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setEmail(text)}
            value={email}
          />
        </View>
      </View>

      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter password' 
            autoCapitalize='none'
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={text=>setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const newUser = await signUp(displayName, email, password);
              console.log('about to add', newUser);
              dispatch(addUser(newUser));
            } catch(error) {
              Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
            }
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>  
      </View>
    </View>
  );
}

function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SignupBox navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#386641',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '70%',

  },
  loginHeaderText: {
    paddingTop: '50%',
    fontSize: 30,
    color: '#F2E8CF',
    position: 'absolute',
    left: 20, 
  },
  loginRow: {
    width: '100%',
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  loginLabelText: {
    fontSize: 18,
    color: "#F2E8CF",
    marginBottom: "2%",
  },
  loginInputContainer: {
    width: '100%',
    backgroundColor: "#F2E8CF",
    borderRadius: 6,
    padding: 5,
  },
  
  loginInputBox: {
    width: '100%',
    borderColor: '#F2E8CF',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: 10,
  },
  button: {
    backgroundColor: "#F2E8CF",   
    paddingVertical: 15,          
    paddingHorizontal: 30,        
    borderRadius: 50,              
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,          
    marginTop: 15,    
    width: "100%",
  },
  buttonText: {
    fontSize: 20,
  
  },
});

export default SignupScreen;
