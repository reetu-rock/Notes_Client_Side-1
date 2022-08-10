import {View, Text, Button, StyleSheet, Image, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';

GoogleSignin.configure({
  webClientId:
    '406334576003-n92hiegplpvoer5v0jpnc8vg3oc65mvk.apps.googleusercontent.com',
});

//Updated code
const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('SwipeRight');
      }
    });
    return subscribe;
  }, []);

  const googleIn = async () => {
    setLoading(true);
    const {idToken} = await GoogleSignin.signIn().catch(e => {
      Alert.alert(e.message);
      setLoading(false);
    });
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    await auth()
      .signInWithCredential(googleCredential)
      .then(res => {
        setUserInfo(res);
        Alert.alert('User Logged In Successfully!');
      })
      .catch(e => {
        Alert.alert(e.message);
      });
    setLoading(false);
  };

  return (
    <View style={styles.center}>
      <View style={styles.center}>
        <Image source={require('../assets/logo.png')} />
      </View>
      <Text>SignIn</Text>
      <Button style={styles.btn} title="Google Sign-In" onPress={googleIn} />
      <Text>{'\n'}</Text>
      {/* <Button style={styles.btn}
       loading={loading}
        title={'Google Sign-Out'}
        onPress={googleOut}/> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    margin: 50,
    paddingBottom: '10%',
  },
});
export default SignIn;
