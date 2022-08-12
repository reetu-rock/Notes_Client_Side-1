import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Home from './components/Home';
import SignIn from './components/SignIn';
import Notes from './components/Notes';

import Showimage from './screens/Showimage';
import Document from './screens/Document';

import OnboardScreen from './screens/OnboardScreen';
import RemindCalendar from './screens/RemindCalendar';

import SwipeRight from './screens/SwipeRight';
import Showpdf from './screens/Showpdf';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LocalScheduledNotification from './components/LocalScheduledNotification';
import HomeCategory from './screens/HomeCategory';
const App = () => {
  const Stack = createNativeStackNavigator();
  //const Tab=
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboard"
          component={OnboardScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SignIn"
          component={SignIn}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SwipeRight"
          component={SwipeRight}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
        />
        <Stack.Screen name="Notes" component={Notes} />

        <Stack.Screen name="Document" component={Document} />
        <Stack.Screen
          options={{headerShown: false}}
          name="Showimage"
          component={Showimage}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Showpdf"
          component={Showpdf}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="LocalScheduledNotification"
          component={LocalScheduledNotification}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="RemindCalendar"
          component={RemindCalendar}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="HomeCategory"
          component={HomeCategory}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3ffff',
  },

  text: {
    fontSize: 16,
  },
});
export default App;
