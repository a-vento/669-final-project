
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';

function SigninBox({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Welcome Back!</Text>
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
              await signIn(email, password);
            } catch(error) {
              Alert.alert("Sign In Error", error.message,[{ text: "OK" }])
            }
          }}
        >
           <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>  
      </View>
    </View>
  );
}


function LoginScreen({navigation}) {

  const [loginMode, setLoginMode] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=> {
    subscribeToAuthChanges(navigation, dispatch);
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
      <SigninBox navigation={navigation}/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#386641',
  },
  bodyContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '70%',

  },
  loginHeader: {
    width: '100%',
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
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
  loginInputBox: {
    width: '100%',
    borderColor: '#F2E8CF',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: 10,
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
  loginButtonRow: {
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  listContainer: {
    flex: 0.7, 
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
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

export default LoginScreen;