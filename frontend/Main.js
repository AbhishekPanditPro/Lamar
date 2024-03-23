
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, 
        Text,
        View, 
        Image, 
        ScrollView, 
        TextInput, 
        Dimensions, 
        Button, 
        Alert, 
        Vibration,
        TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as Speech from 'expo-speech';


import { API_BASE_URL } from './config'; // Adjust the path as necessary

// Use API_BASE_URL as needed
console.log(API_BASE_URL);
const {width,height} = Dimensions.get('window');

const colo = ['red','lightblue','rgba(0,255,123,1)','grey']
const col = colo[Math.floor(Math.random() * colo.length)];

export default function App() {
    const navigation  = useNavigation();
    const newaccount = () =>{
        Vibration.vibrate(5);
        navigation.navigate('NewAccount');
    }
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const handleLogin = async () => {
        Vibration.vibrate(15);
        if (inputEmail.length ==0 || inputPassword.length ==0){
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid!'
                  });
                
              }, 500);
            setInputEmail('');
            setInputPassword('')
            return;
        }
        try {


          const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: inputEmail,
              password: inputPassword,
            }),
          });
          const data = await response.json();
          if (data.found) {
            console.log('Credentials match, proceed with login.');
            setInputEmail('');
            setInputPassword('');
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1:`Welcome ${data.namee}!`
                  });
                
              }, 500);
            
            navigation.navigate('CameraScreen');
            // Proceed with login (e.g., navigate to the home screen)
          } else {
            console.log('No matching credentials found.');
            // Handle login failure (e.g., show an alert or message)

              Toast.show({
                type: 'error',
                text1: 'Email or Password was wrong!'
              });
            setInputPassword('');
          }
        } catch (error) {
          console.error(error);
          setTimeout(() => {
            Toast.show({
                type: 'error',
                text1: 'Email or Password was wrong!'
              });
            
          }, 2000);
          setInputEmail('');
          setInputPassword('');
          // Handle network or server error
        }
      };
    





  return (
    <View style = {styles.container}>
        {/* <Toast /> */}
        <View style={styles.outerContainer}>
          <View style={styles.login_container}>
            
            <Text style={{fontWeight:"bold", fontStyle:"italic"}}>Email:</Text>
            <TextInput style ={styles.email} placeholder='Enter email' keyboardType="email-address" value={inputEmail} onChangeText={text => setInputEmail(text)} autoCapitalize="none"></TextInput>
            <Text style={styles.passtext}>Password:</Text>
            <TextInput style = {styles.email} secureTextEntry={true} placeholder="Enter password"  value={inputPassword} onChangeText={text => setInputPassword(text)} autoCapitalize="none"/>
            <Text style= {styles.new_account} onPress={newaccount}>Create a new account?</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{fontWeight:"bold", fontSize:18}}>Submit</Text>
            </TouchableOpacity>
            
          </View>

        </View>

      
        <Toast />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: col,
    // borderWidth: 1,
    elevation:5
    
  },
  outerContainer: {
    backgroundColor: col,
    elevation: 5,
    borderRadius: 30, 


  },
  login_container: {
   
    height:height * 0.5,
    width: width * 0.85,
    borderWidth:2,
    borderColor:'white',

    borderRadius: 30,
    backgroundColor:'rgba(255, 255, 255, 0.7)',
    padding:20,
    overflow:'hidden',
    // elevation: 5,
    paddingTop:60,
    
  },
  email:{
    marginTop:10,
    borderWidth:1,
    backgroundColor:'white',
    borderRadius:20,
    height:50,
    paddingLeft:20,
    

  },
  passtext:{
    marginTop:17,
    fontWeight:"bold",
     fontStyle:"italic"
  },
  new_account:{
    marginTop: 5,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',

  },
  button:{
    marginTop:10, 
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    height:40,
    borderRadius:50,
 
  }


});
