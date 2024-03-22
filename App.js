import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './Main';
import NewAccount from './NewAccount';
import CameraScreen from './CameraScreen';


const Stack = createStackNavigator();




export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main' screenOptions={{headerShown:false}}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="NewAccount" component={NewAccount} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
