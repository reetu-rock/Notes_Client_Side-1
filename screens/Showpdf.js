import React, {useState, useEffect} from 'react';
import {StyleSheet, Dimensions, View, Button, Alert} from 'react-native';
import Pdf from 'react-native-pdf';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import Share from 'react-native-share';

const Showpdf = props => {
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

  const source = {
    //uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    cache: true,
    uri: props.route.params.url,
  };

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
    <View style={styles.container}>
      <View style={styles.conatiner}>
        <View style={styles.btn}>
          <Button title="Delete PDF" onPress={() => deletedoc()} />
        </View>
        <View style={styles.btn}>
          <Button
            title="Share PDF"
            onPress={() => {
              onShare();
            }}
          />
        </View>
      </View>
      <Pdf trustAllCerts={false} source={source} style={styles.pdf} />
    </View>
  );
};

export default Showpdf;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  conatiner: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    //margin: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  btn: {
    flexDirection: 'row',
    padding: 5,
    //margin: 10,
  },
});
