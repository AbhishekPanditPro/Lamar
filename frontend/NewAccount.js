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
        TouchableOpacity
        } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from './config'; // Adjust the path as necessary
// Use API_BASE_URL as needed
// console.log(API_BASE_URL);


const {width,height} = Dimensions.get('window');

const colo = ['red','lightblue','rgba(0,255,123,1)','grey']
const col = colo[Math.floor(Math.random() * colo.length)];


export default function NewAccount() {
    const [inputfirstname,setfirstname] = useState('');
    const [inputlastname,setlastname] = useState('');
    const [inputemail,setemail] = useState('');
    const [inputpassword,setpassword] = useState('');
    const [inputconfirmPassword,setconfirmPassword] = useState('');  
    const navigation  = useNavigation();

    

    const showTimedAlert = (message, duration = 2000) => { // Default duration to 2 seconds
        Alert.alert(message);
        setTimeout(() => {
          // Code to close the alert (not applicable in React Native's Alert)
        }, duration);
      };
    const handlenewaccount = async () => {
        Vibration.vibrate(10);
        if (inputfirstname.length == 0 || inputlastname.length == 0 || inputemail.length == 0 || inputpassword.length == 0){
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    text1: 'Credentials are missing!'
                  });
                
              }, 500); 
            return;
        }
        if (inputpassword != inputconfirmPassword){
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    text1: 'Password does not match!'
                  });
                
              }, 500); 
            setconfirmPassword('');
            return;
        }
        else{
            try {
                const response = await fetch(`${API_BASE_URL}/newaccount`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    email: inputemail,
                    firstname: inputfirstname,
                    lastname: inputlastname,
                    password: inputpassword,
                    }),
                });
                const data = await response.json();
                if (data.found) {
                    console.log('There is already credentials in the database.');
                    // Handle login failure (e.g., show an alert or message)
                    // setInputPassword('');
                    setTimeout(() => {
                        Toast.show({
                            type: 'error',
                            text1: 'Email already exists!'
                          });
                        
                      }, 500); 
                      setemail('');
                      setpassword('');
                      setconfirmPassword('');

                } else {
                    console.log('Credentials inserted');     
                    setTimeout(() => {
                        Toast.show({
                            type: 'error',
                            text1: 'Account Created!'
                          });
                        
                      }, 2000); 
                    navigation.navigate('Main');
                    // Proceed with login (e.g., navigate to the home screen)
                }
                } catch (error) {
                console.error(error);
                setInputemail('');
                setinputPassword('');
                
                // Handle network or server error
                }
            
        }
        
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Toast />
        <View style={styles.outerContainer}>
          <View style={styles.login_container}>
          <Text style={{fontWeight:"bold", fontStyle:"italic"}}>First Name:</Text>
            <TextInput style ={styles.email} placeholder='first name' value={inputfirstname} onChangeText={text =>setfirstname(text)}></TextInput>
            <Text style={{marginTop: 10,fontWeight:"bold", fontStyle:"italic"}}>Last Name:</Text>
            <TextInput style = {styles.email} placeholder="last name" value={inputlastname} onChangeText={text =>setlastname(text)}/>
            <Text  style={{marginTop: 10,fontWeight:"bold", fontStyle:"italic"}}>Email:</Text>
            <TextInput style ={styles.email} placeholder='enter email' keyboardType="email-address" autoCapitalize="none" value={inputemail} onChangeText={text =>setemail(text)}></TextInput>
            <Text style={{marginTop: 10,fontWeight:"bold", fontStyle:"italic"}}>Password:</Text>
            <TextInput style = {styles.email} secureTextEntry={true} placeholder="password" autoCapitalize="none" value={inputpassword} onChangeText={text =>setpassword(text)}/>
            <Text style={{marginTop: 10,fontWeight:"bold", fontStyle:"italic"}}>Confirm Password:</Text>
            <TextInput style = {styles.email} secureTextEntry={true} placeholder="confirm password" autoCapitalize="none" value={inputconfirmPassword} onChangeText={text =>setconfirmPassword(text)}/>
            
            <TouchableOpacity style={styles.button} onPress={handlenewaccount}>
                <Text style={{fontWeight:"bold", fontSize:18}}>Create</Text>
            </TouchableOpacity>
            

            
          </View>

        </View>

      
        <Toast
            />
    </ScrollView>
    
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
   
    height:height * 0.7,
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
    marginTop:5,
    borderWidth:1,
    backgroundColor:'white',
    borderRadius:20,
    height:50,
    paddingLeft:20,
  },
  button:{
    marginTop:20, 
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    height:40,
    borderRadius:50,
 
  },
});
