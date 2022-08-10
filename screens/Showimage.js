import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Share from 'react-native-share';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

const Showimage = props => {
  const [Uid, setUid] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(user => {
      if (user) {
        var googleuid = user.uid;
        setUid(googleuid);
      }
    });
    subscribe();
  }, []);

  const deletedoc = () => {
    axios
      .delete(`http://10.0.2.2:5000/deletedoc/`, {
        data: {id: props.route.params.id, guid: Uid},
        //data: 'foo',
      })
      .then(res => {
        Alert.alert('Item Removed');
        console.log(props.route.params.id);
        navigation.navigate('SwipeRight');
      });
  };

  const onShare = () => {
    let options = {
      title: 'Document',
      //message: information,
      url: props.route.params.url,
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View>
      <View style={styles.conatiner}>
        <View style={styles.btn}>
          <Button
            title="Delete Image"
            onPress={() => {
              deletedoc();
            }}
          />
        </View>
        <View style={styles.btn}>
          <Button
            title="Share Image"
            onPress={() => {
              onShare();
            }}
          />
        </View>
      </View>

      <ImageBackground
        source={{uri: props.route.params.url}}
        style={styles.display}
      />
    </View>
  );
};

export default Showimage;
const styles = StyleSheet.create({
  conatiner: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    //margin: 10,
  },
  display: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: deviceHeight - 150,
    width: deviceWidth,
  },
  btn: {
    flexDirection: 'row',
    padding: 5,
    //margin: 10,
  },
});
