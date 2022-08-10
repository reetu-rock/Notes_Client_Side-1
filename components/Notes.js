import {
  View,
  Text,
  // Button,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import IsReachable from './IsReachable.js';
import styles from './styles.js';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
import {RadioButton} from 'react-native-paper';
import CustomSwitch from './CustomSwitch';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

//const fe_version = 2;

const Home = () => {
  const navigation = useNavigation();
  const [Reach, setReach] = useState(false);
  const [Uid, setUid] = useState('');
  const [Email, setEmail] = useState('');
  const [note, setnote] = useState('');
  const [notes, setnotes] = useState([]);
  const [EditID, setEditID] = useState('');
  const [editText, setEditText] = useState('');
  const [edit, setEdit] = useState(true);
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [RemindData, setRemindData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Category, setCategory] = useState('');
  const [value, setValue] = useState(1);
  const [UserID, setUserID] = useState(null);
  const [Color, setColor] = useState('');
  const [Catname, setCatname] = useState('');
  const [CATID, setCATID] = useState('');
  const [PhotoUrl, setPhotoUrl] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);

  const storeData = async notes => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem('notes', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('notes');
      return jsonValue != null ? setnotes(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  };

  const removeData = async notes => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem('notes', jsonValue);
    } catch (e) {
      // saving error
    }
    Alert.alert('Item Removed');
  };

  const editData = async notes => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem('notes', jsonValue);
    } catch (e) {
      // saving error
    }
    Alert.alert('Item Edited');
  };

  const server = async () => {
    const data = await IsReachable();
    console.log('data of server', data);
    setReach(data);
    console.log('data of setReach', Reach);
  };

  useEffect(() => {
    server();
  }, [Reach]);

  //sign out
  const googleOut = async () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert('User sign-out successfully!');
        navigation.navigate('SignIn');
      })
      .catch(e => Alert.alert('Error', e.message));
  };

  //edit note
  const editnote = (Id, catId) => {
    notes.map(item => {
      if (edit && item.Id === Id) {
        setEdit(!edit);
        setEditText(item.Notes);
        setEditID(item.Id);
      }
    });

    // if (edit) setEdit(!edit);
    if (!edit) {
      if (Reach) {
        axios
          .put(
            'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_update',

            {
              data: {
                id: Id,
                status: 1,
                userid: UserID,
                moduleid: 1,
                catid: catId,
                name: 'Test',
                notes: editText,
                remind: '',
                reminds: '',
                remindf: '',
              },
            },
          )

          .then(res => {
            setnotes(
              notes.map(item =>
                item.Id === Id
                  ? {
                      Id: item.Id,
                      Notes: editText,
                      Cat: item.Cat,
                    }
                  : item,
              ),
            );
          });
      } else {
        let data2 = notes.map(item =>
          item.Id === Id
            ? {
                Id: item.Id,
                info: editText,
                Cat: item.Cat,
              }
            : item,
        );
        setEditText('');
        setnotes(data2);
        editData(data2);
      }
      setEdit(true);
    }
  };

  const GoBack = id => {
    let data2 = notes.map(item =>
      item.id === id
        ? {
            id: item.id,
            info: item.info,
            cat: item.cat,
          }
        : item,
    );
    setnotes(data2);
    setEdit(true);
  };

  //delete note
  const deletenote = Id => {
    if (Reach) {
      axios
        .post(
          'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_delete',
          {
            data: {
              id: Id,
              userid: UserID,
              moduleid: 1,
            },
          },
        )
        .then(res => {
          setnotes(notes.filter(item => item.Id != Id));
          Alert.alert('Item Removed');
          console.log(res.data);
        });
    } else {
      let data1 = notes.filter(item => item.Id !== Id);
      setnotes(notes.filter(item => item.Id !== Id));
      removeData(data1);
    }
  };

  //share note
  const share = Id => {
    notes.map(item => {
      if (item.Id === Id) {
        //console.log(item.Id);
        console.log(Id);
        //console.log(item.Notes);
        onShare(item.Notes);
      }
    });
  };

  const onShare = information => {
    let options = {
      title: 'Awesome Contents',
      message: information,
      url: 'https://www.mail-signatures.com/wp-content/uploads/2019/02/How-to-find-direct-link-to-image_Blog-Picture.png',
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const Picker = info => {
    setRemindData(info);
  };

  const showDatePicker = () => {
    setDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
  };

  const handleConfirmDateTime = dateTime => {
    hideDateTimePicker();
    PushNotification.createChannel({
      channelId: 'Scheduled Channel',
      channelName: 'My Scheduled Channel',
    });
    PushNotification.localNotificationSchedule({
      channelId: 'Scheduled Channel',
      title: 'REMINDER',
      message: 'Reminder: ' + RemindData,
      date: dateTime,
    });

    Alert.alert('Reminder Added ' + dateTime);

    axios.post('http://10.0.2.2:5000/createrem/', {
      id: uuid.v4(),
      guid: Uid,
      info: RemindData,
      timedate: dateTime,
    });
  };

  //Adding userId from school wise

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

  //adding note
  const addnote = () => {
    setModalVisible(!modalVisible);

    if (Reach) {
      if (!note) return;
      else {
        if (value == 1) {
          setCatname('General');
          setCATID('17');
          setColor('#66ff33');
        }
        if (value == 2) {
          setCatname('home');
          setCATID('1');
          setColor('#3399ff');
        }
        if (value == 3) {
          setCatname('office');
          setCATID('3');
          setColor('#ff66ff');
        }
        if (value == 4) {
          setCatname('medical');
          setCATID('4');
          setColor('#666633');
        }
        if (value == 5) {
          setCatname('Vehicle');
          setCATID('18');
          setColor('#9900ff');
        }
        if (value == 6) {
          setCatname('Bills');
          setCATID('19');
          setColor('#666699');
        }
        if (value == 7) {
          setCatname(Category);
          setCATID('false');
          setColor('#993333');
        }
        axios
          .post(
            'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_add',
            {
              data: {
                status: 1,
                userid: UserID,
                moduleid: 1,
                catid: CATID,
                cat: Catname,
                name: 'Test',
                notes: note,
                remind: 0,
                reminds: '',
                remindf: '',
              },
            },
          )
          .then(response => {
            setnotes([
              ...notes,
              {
                Id: response.data.data[0],
                UserId: UserID,
                ModuleId: 1,
                Cat: Catname,
                CatId: CATID,
                Name: 'Test',
                Notes: note,
                Status: 1,
                Remind: 1,
                RemindS: '',
                RemindF: '',
              },
            ]);
          });

        setnote('');
        setCategory('');
        setValue(null);
      }
    } else {
      if (!note) return;
      if (value == 1) {
        setCatname('General');
        setCATID('17');
        setColor('#66ff33');
      }
      if (value == 2) {
        setCatname('home');
        setCATID('1');
        setColor('#3399ff');
      }
      if (value == 3) {
        setCatname('office');
        setCATID('3');
        setColor('#ff66ff');
      }
      if (value == 4) {
        setCatname('medical');
        setCATID('4');
        setColor('#666633');
      }
      if (value == 5) {
        setCatname('Vehicle');
        setCATID('18');
        setColor('#9900ff');
      }
      if (value == 6) {
        setCatname('Bills');
        setCATID('19');
        setColor('#666699');
      }
      if (value == 7) {
        setCatname(Category);
        setCATID('false');
        setColor('#993333');
      }
      console.log(value);
      console.log(Catname);
      console.log(CATID);
      console.log(Color);
      let data = [
        ...notes,
        {
          Id: uuid.v4(),
          guid: Date.now(),
          catId: CATID,
          notes: note,
          cat: Catname,
          color: Color,
        },
      ];
      setnotes(data);
      setnote('');
      setCategory('');
      storeData(data);
    }
    setEdit(true);
  };

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
              'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_list',
              {
                data: {
                  userid: UserID,
                  moduleid: 1,
                  order: 'CDate',
                  status: 1,
                  limit: 100,
                },
              },
            )
            .then(function (res) {
              //console.log(res.data);
              const filled = res.data.data;
              if (filled == false) {
                Alert.alert(res.data.msg);
              } else {
                setnotes(res.data.data);
              }
            });
        }
      }
    });

    subscribe();
  }, []);

  useEffect(() => {
    if (!Reach) {
      getData();
    }
  }, []);

  const onSelectSwitch = index => {
    //alert('Selected index: ' + index);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading}>notes</Text>

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
              marginLeft: 230,
            }}
            source={{
              uri: PhotoUrl,
            }}
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {notes.map(item => {
          if (edit) {
            return (
              <TouchableOpacity
                style={styles.note}
                onPress={() => editnote(item.Id, item.catid)}>
                <View
                  style={{
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                    height: 40,
                    width: 350,
                  }}>
                  <Text style={styles.txt321}>Category: {item.Cat}</Text>
                  <View
                    style={{
                      marginTop: 0,
                      marginLeft: 5,
                      width: 25,
                      height: 25,
                      backgroundColor: item.color,
                    }}
                  />
                </View>
                <View
                  style={{
                    paddingHorizontal: 5,
                    //flexDirection: 'row',
                    height: 40,
                    width: 350,
                  }}>
                  <Text style={styles.txt}>{item.Notes}</Text>
                </View>
                <View style={styles.note1}>
                  {/* <TouchableOpacity
                    name="Reminder"
                    size={24}
                    color="black"
                    onPress={showDatePicker}
                    onPressIn={() => {
                      Picker(item.info);
                    }}>
                    <Image
                      style={{
                        height: 35,
                        //borderRadius: 50,
                        width: 35,
                        //margin: 2,
                        marginRight: 10,
                        marginLeft: -10,

                        marginBottom: 10,
                        alignSelf: 'center',
                      }}
                      source={require('../assets/remind.png')}
                    />
                  </TouchableOpacity> */}
                  <DateTimePickerModal
                    isVisible={dateTimePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirmDateTime} //, item.info)}
                    onCancel={hideDateTimePicker}
                  />
                  <TouchableOpacity
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => editnote(item.Id)}>
                    <Image
                      style={styles.custom_button}
                      source={require('../assets/edit.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    name="delete"
                    size={24}
                    color="black"
                    onPress={() => deletenote(item.Id)}>
                    <Image
                      style={styles.custom_button}
                      source={require('../assets/delete.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    name="share"
                    size={24}
                    color="black"
                    onPress={() => {
                      share(item.Id);
                    }}>
                    <Image
                      style={styles.custom_button}
                      source={require('../assets/share.png')}
                    />
                  </TouchableOpacity>
                  {/* <CustomSwitch
                    selectionMode={1}
                    roundCorner={true}
                    option1={'Active'}
                    option2={'Done'}
                    onSelectSwitch={onSelectSwitch}
                    selectionColor={'green'}
                  /> */}
                </View>
              </TouchableOpacity>
            );
          }
          if (!edit && item.Id === EditID) {
            return (
              <View style={styles.note321}>
                <Text style={styles.txt321}>Category: {item.Cat}</Text>
                <TextInput
                  style={styles.inp321}
                  value={editText}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={text => setEditText(text)}
                />
                <View style={styles.note1}>
                  <TouchableOpacity
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => editnote(item.Id)}>
                    <Text style={styles.button_txt2}>EditText</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => GoBack(item.Id)}>
                    <Text style={styles.button_txt2}>GoBack</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
        })}

        {/* Modal started */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter a new note!! </Text>

              {/* {renderLabel()} */}

              <View>
                <Text>Choose a category </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  <View style={{alignSelf: 'center'}}>
                    <Text>General</Text>
                  </View>
                  <View style={{marginLeft: 50, alignSelf: 'center'}}>
                    <RadioButton
                      value="first"
                      status={value === 1 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('first')}
                      onPress={() => setValue(1)}
                    />
                  </View>
                  <View style={{marginLeft: 50, alignSelf: 'center'}}>
                    <Text>Home</Text>
                  </View>
                  <View style={{marginLeft: 50, alignSelf: 'center'}}>
                    <RadioButton
                      value="second"
                      status={value === 2 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('second')}
                      onPress={() => setValue(2)}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                  <View style={{alignSelf: 'center'}}>
                    <Text>Office</Text>
                  </View>
                  <View style={{marginLeft: 62, alignSelf: 'center'}}>
                    <RadioButton
                      value="third"
                      status={value === 3 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('third')}
                      onPress={() => setValue(3)}
                    />
                  </View>
                  <View style={{marginLeft: 50, alignSelf: 'center'}}>
                    <Text>Medical</Text>
                  </View>
                  <View style={{marginLeft: 40, alignSelf: 'center'}}>
                    <RadioButton
                      value="fourth"
                      status={value === 4 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('fourth')}
                      onPress={() => setValue(4)}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                  <View style={{alignSelf: 'center'}}>
                    <Text>Vehicle</Text>
                  </View>
                  <View style={{marginLeft: 55, alignSelf: 'center'}}>
                    <RadioButton
                      value="fifth"
                      status={value === 5 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('fifth')}
                      onPress={() => setValue(5)}
                    />
                  </View>
                  <View style={{marginLeft: 50, alignSelf: 'center'}}>
                    <Text>Bills</Text>
                  </View>
                  <View style={{marginLeft: 62, alignSelf: 'center'}}>
                    <RadioButton
                      value="sixth"
                      status={value === 6 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('sixth')}
                      onPress={() => setValue(6)}
                    />
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <View style={{alignSelf: 'center'}}>
                    <Text>Enter a custom category</Text>
                  </View>
                  <View style={{marginLeft: 50, alignSelf: 'center'}}>
                    <RadioButton
                      value="seventh"
                      status={value === 7 ? 'checked' : 'unchecked'}
                      //onPress={() => setChecked('seventh')}
                      onPress={() => setValue(7)}
                    />
                  </View>
                </View>
              </View>

              {value == 7 ? (
                <TextInput
                  style={styles.inp1}
                  onChangeText={text => setCategory(text)}
                  placeholder="Enter a custom category"
                />
              ) : null}
              <TextInput
                style={styles.inp1}
                onChangeText={text => setnote(text)}
                placeholder="Enter the note"
              />
              <Text>{'\n'}</Text>

              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button123, styles.buttonClose]}
                  //onPress={() => setModalVisible(!modalVisible)}>
                  onPress={addnote}>
                  <Text style={styles.textStyle}>Save It!!</Text>
                </Pressable>
                <Pressable
                  style={[styles.button123, styles.buttonClose]}
                  //onPress={() => setModalVisible(!modalVisible)}>
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <TouchableOpacity
        style={styles.button_Add}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.buttontxt}>Add!!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
