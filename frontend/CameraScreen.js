import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text, Dimensions, TouchableOpacity, Alert , Modal, ScrollView, SafeAreaView, Vibration} from 'react-native';
import { Camera } from 'expo-camera';
import Toast from 'react-native-toast-message'; 
import { API_BASE_URL } from './config';
// import { ImagePicker, FileSystem } from 'expo';
import * as Speech from 'expo-speech';


const {width,height} = Dimensions.get('window');



export default function CameraScreen() {
  // Camera permissions and type state
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [lastTap, setLastTap] = useState(null);
  const [doubleTap, setDoubleTap] = useState(false);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);


  const [modalVisible, setModalVisible] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Toggle the camera type (front/back)
  const toggleCameraType = () => {
    Vibration.vibrate(3);
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  // Handle no permissions granted
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      // console.log(data.uri);
      setImageUri(data.uri);
      return data.uri;

    }
  };



  const sendDataToServer = async (imageUri) => {
    console.log('Sending data to server...');
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust based on your image type
      name: 'image.jpg',
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-image`, {
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data', // This line might be omitted
        },
      });
      Toast.show({
        type: 'info',
        text1: 'Analyzing!'
      });
      const data = await response.json();
      Toast.show({
        type: 'success',
        text1: 'Success!'
      });
      console.log(typeof data);
      console.log(data); // Process or display the returned data as needed
      console.log(data.description);
      // Alert.alert(data.description);
      setDescriptionText(data.description); // Set the description text
      setModalVisible(true);
      Speech.speak(data.description);
      // console.log();
    } catch (error) {
      console.error("Could not send data to server:", error);
      Toast.show({
        type: 'error',
        text1: 'Trying Again!',
      });
      sendDataToServer(imageUri);
    }
  };
  
  
  
  
  const handleDoubleTap = async () => {
    Vibration.vibrate(1);
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // milliseconds
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      setDoubleTap(true);
      // setImageUri(await takePicture());
      // Double tap detected, you can execute your logic here
      const imagee = await takePicture();
      console.log('Double tap detected');
      // Vibration.vibrate(1);
      
      // console.log('--->', imageUri);
      console.log('-----=>', imagee)
      sendDataToServer(imagee);
    } else {
      setDoubleTap(false);
      // Not a double tap, update the lastTap time
      setLastTap(now);
    }
  };


  return (
    <View style={styles.container}>

     <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            <SafeAreaView>
              <Text style={styles.modalText}>{descriptionText}</Text>
            </SafeAreaView>
          </ScrollView>
          <TouchableOpacity style={styles.close} onPress={() => {setModalVisible(!modalVisible);
                  Speech.stop()
                  Vibration.vibrate(3)}}>
            <Text style={{color:"white", fontWeight:'bold'}}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </Modal>

      <View style={styles.cameracontainer}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)} >
        <TouchableOpacity onPress={handleDoubleTap} activeOpacity={0.2} style={styles.dbltap}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity title="Toggle Camera" onPress={toggleCameraType} >
            <Text style={{color:"white", fontWeight:'bold'}}>TOGGLE CAMERA</Text></ TouchableOpacity>
        </View>
        </TouchableOpacity>
      
      </Camera>
      </View>
      <Toast />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent:'center',
    backgroundColor:'grey',
  },
  camera: {
    // flex: 1,
    // aspectRatio: 0.5, // Adjust based on your needs

    height:height * 0.7,

  },
  buttonContainer: {
    backgroundColor: 'green',
    flexDirection: 'row',
    margin: 20,
    marginTop:30,
    backgroundColor:"white",
    width: width*0.35,
    height: height*0.04,
    alignItems:'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor:"red",
    zIndex:1,




  },
  cameracontainer:{
    borderWidth:1,
    borderRadius:20,
    overflow:'hidden',
    height: height* 0.7,
    // backgroundColor:'white',
    zIndex:1,
    
  },
  dbltap:{
    // borderWidth:1,
    borderRadius:20,
    // overflow:'hidden',
    height: height* 0.7,
    backgroundColor:'transparent',
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    
    
  },
  modalView: {
    margin: 25,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth:2,
    borderColor:'#00ff00',
    height:220,
    backgroundColor: 'grey',

    
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    color:'white',
    fontWeight:'bold',
    


  },
  close:{
    flexDirection: 'row',
    marginTop:16,
    marginBottom:-5,
    width: width*0.20,
    height: height*0.04,
    alignItems:'center',
    justifyContent: 'center',
    borderRadius:20,
    backgroundColor:"red",
    zIndex:1,
  },

});
