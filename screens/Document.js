import {
  View,
  //Button,
  StyleSheet,
  PermissionsAndroid,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
//import styles from './styles.js';
import styles from '../components/styles';
import storage from '@react-native-firebase/storage';
import IsReachable from '../components/IsReachable';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';

const fe_version = 2;

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
const Document = () => {
  const navigation = useNavigation();
  const [Reach, setReach] = useState(true);
  const [Uid, setUid] = useState('');
  const [alldocURL, setalldocURL] = useState([]);
  const [PhotoUrl, setPhotoUrl] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [Email, setEmail] = useState('');
  const [UserID, setUserID] = useState(null);

  const googleOut = async () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert('User sign-out successfully!');
        navigation.navigate('SignIn');
      })
      .catch(e => Alert.alert('Error', e.message));
  };

  useEffect(() => {
    axios
      .post(
        'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/login',
        {
          data: {
            email: Email,
            fname: '',
            lname: '',
            socialid: Uid,
          },
        },
      )
      .then(res => {
        setUserID(res.data.data.userdata[0].Id);
      });
  }, []);

  console.log('Saved user ID ' + UserID);

  const server = async () => {
    const data = await IsReachable();
    setReach(data);
    //console.log(data);
  };

  useEffect(() => {
    server();
  }, []);

  //Fetching Images

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(user => {
      if (user) {
        var googleuid = user.uid;
        var email = user.email;
        var ProfilePictiure = user.photoURL;
        setUid(googleuid);
        setEmail(email);
        setPhotoUrl(ProfilePictiure);
        //fetching from server
        if (Reach) {
          axios
            .post(
              `https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_list`,
              {
                data: {
                  userid: UserID,
                  moduleid: 4,
                  order: 'CDate',
                  status: 1,
                  limit: 100,
                },
              },
            )
            .then(res => {
              const filled = res.data.data;
              console.log(filled);
              if (filled == false) {
                Alert.alert('No entry');
              } else {
                setalldocURL(res.data.data);
                //console.log(alldocURL);
              }
            });
        }
      }
    });
    subscribe();
  }, []);
  console.log(alldocURL);
  const docPic = async () => {
    try {
      const res = await DocumentPicker.pick({
        copyTo: 'documentDirectory',
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      const data = res[0].fileCopyUri;
      console.log(data);
      if (data.search(/.pdf/ || /.PDF/) >= 1) {
        //console.log(data.search(/.pdf/ || /.PDF/));
        var Cid = 'P.D.F' + Date.now();
        const uploadTask = storage()
          .ref()
          .child(`/uploads/${Cid}`)
          .putFile(data);
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              Alert.alert('File Upload Complete');
              fetchuploader(Cid, Uid);
            }
          },
          error => {
            Alert.alert(error);
          },
        );
      } else {
        //console.log(data.search(/.pdf/ || /.PDF/));
        var Cid = 'Image' + Date.now();
        const uploadTask = storage()
          .ref()
          .child(`/uploads/${Cid}`)
          .putFile(data);
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              Alert.alert('File Upload Complete');
              fetchuploader(Cid, Uid);
            }
          },
          error => {
            Alert.alert(error);
          },
        );
      }
    } catch (err) {
      Alert.alert('Pls pic a document');
    }
  };

  const fetchuploader = async (Cid, Uid) => {
    const path = await storage().ref(`/uploads/${Cid}`).getDownloadURL();
    console.log(path);

    axios
      .post(
        'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_add',
        {
          data: {
            status: 1,
            userid: UserID,
            moduleid: 4,
            catid: 36,
            cat: 'Default',
            name: 'Default',
            notes: path,
            remind: 0,
            reminds: '',
            remindf: '',
          },
        },
      )
      .then(response => {
        //setalldocURL([...alldocURL, {id: Cid, guid: Uid, link: path}]);

        setalldocURL([
          ...alldocURL,
          {
            Id: response.data.data[0],
            UserId: UserID,
            ModuleId: 3,
            Cat: Catname,
            CatId: CATID,
            Name: 'Test',
            Notes: path,
            Status: 1,
            Remind: 1,
            RemindS: '',
            RemindF: '',
          },
        ]);
      });
  };

  return (
    <View>
      <View style={styles.container1}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.btn}>
            {/* <Button title="Upload Document" onPress={docPic} /> */}
            <Button
              style={{width: 200, alignSelf: 'center'}}
              mode="contained"
              onPress={docPic}>
              Upload Document
            </Button>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={() => {
              setModalVisible1(!modalVisible1);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView1}>
                <Image
                  style={{
                    height: 60,
                    borderRadius: 50,
                    width: 60,
                    margin: 2,
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: PhotoUrl,
                  }}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}>
                  {Email}
                </Text>
                <Button
                  style={{width: 200, alignSelf: 'center'}}
                  mode="contained"
                  onPress={googleOut}>
                  Google Sign-Out
                </Button>
                <Button
                  style={{width: 200, alignSelf: 'center', marginTop: 10}}
                  mode="contained"
                  onPress={() => setModalVisible1(!modalVisible1)}>
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
          <Pressable onPress={() => setModalVisible1(true)}>
            <Image
              style={{
                height: 60,
                borderRadius: 50,
                width: 60,
                margin: 2,
                marginLeft: 50,
              }}
              source={{
                uri: PhotoUrl,
              }}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView>
        <View style={styles.display}>
          {alldocURL.map(item => {
            if (item.Notes.search(/P.D.F/) >= 1) {
              //console.log(item.link.search(/P.D.F/));
              return (
                <TouchableOpacity
                  key={item.Id}
                  onPress={() =>
                    navigation.navigate('Showpdf', {
                      url: item.Notes,
                      id: item.Id,
                    })
                  }>
                  <Image
                    style={{
                      height: deviceHeight / 4.5,
                      borderRadius: 10,
                      width: deviceWidth / 3 - 4,
                      margin: 2,
                    }}
                    source={require('../assets/PDF.png')}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  key={item.Id}
                  onPress={() =>
                    navigation.navigate('Showimage', {
                      url: item.Notes,
                      id: item.Id,
                    })
                  }>
                  <Image
                    style={{
                      height: deviceHeight / 4.5,
                      borderRadius: 10,
                      width: deviceWidth / 3 - 4,
                      margin: 2,
                    }}
                    source={{uri: item.Notes}}
                  />
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Document;
