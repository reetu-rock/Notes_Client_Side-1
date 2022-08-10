import {View, Text, StyleSheet, Image, Button} from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
const OnboardScreen = ({navigation}) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('SignIn')}
      onDone={() => navigation.navigate('SignIn')}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assets/onboarding-img1.png')}
              style={{width: 200, height: 200}}
            />
          ),
          title: 'Schedule your tasks',
          subtitle: 'Get it done and feel the change',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assets/onboarding-img2.png')}
              style={{width: 200, height: 200}}
            />
          ),
          title: 'Get it Noted',
          subtitle: 'Complete the tasks on time',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assets/onboarding-img3.png')}
              style={{width: 200, height: 200}}
            />
          ),
          title: 'Keep an eye on every task',
          subtitle: 'feel relaxed after completion',
        },
      ]}
    />
  );
};

export default OnboardScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
