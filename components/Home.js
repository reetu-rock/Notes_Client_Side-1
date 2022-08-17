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
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [EditID, setEditID] = useState('');
  const [editText, setEditText] = useState('');
  const [edit, setEdit] = useState(true);
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [RemindData, setRemindData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Value, setValue] = useState(null);
  const [UserID, setUserID] = useState(null);
  const [Catname, setCatname] = useState('');
  const [CATID, setCATID] = useState('');
  const [PhotoUrl, setPhotoUrl] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [RenderState, setRenderState] = useState(null);
  const [Tray, setTray] = useState(false);
  const [Fav, setFav] = useState(0);

  const storeData = async todos => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todos');
      return jsonValue != null ? setTodos(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  };

  const removeData = async todos => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', jsonValue);
    } catch (e) {
      // saving error
    }
    Alert.alert('Item Removed');
  };

  const editData = async todos => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', jsonValue);
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

  //edit todo
  const edittodo = (Id, catId) => {
    todos.map(item => {
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
                userid: UserID,
                name: '',
                status: 1,
                notes: editText,
                remind: '',
                reminds: '',
                remindf: '',
                status: 1,
              },
            },
          )

          .then(res => {
            setTodos(
              todos.map(item =>
                item.Id === Id
                  ? {
                      Id: item.Id,
                      UserId: UserID,
                      ModuleId: 1,
                      Cat: item.Cat,
                      Catid: CATID,
                      Name: 'Test',
                      Notes: editText,
                      Status: 1,
                      remind: 0,
                      reminds: '',
                      remindf: '',
                      date: Date.now(),
                    }
                  : item,
              ),
            );
          });
      } else {
        let data2 = todos.map(item =>
          item.Id === Id
            ? {
                Id: item.Id,
                UserId: UserID,
                ModuleId: 1,
                Cat: item.Cat,
                Catid: CATID,
                Name: 'Test',
                Notes: editText,
                Status: 1,
                remind: 0,
                reminds: '',
                remindf: '',
                date: Date.now(),
              }
            : item,
        );
        setEditText('');
        setTodos(data2);
        editData(data2);
      }
      setEdit(true);
    }
  };

  const GoBack = id => {
    let data2 = todos.map(item =>
      item.id === id
        ? {
            id: item.id,
            info: item.info,
            cat: item.cat,
          }
        : item,
    );
    setTodos(data2);
    setEdit(true);
  };

  //delete todo
  const deletetodo = Id => {
    if (Reach) {
      axios
        .post(
          'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/ledger_delete',
          {
            data: {
              id: Id,
              userid: UserID,
            },
          },
        )
        .then(res => {
          setTodos(todos.filter(item => item.Id != Id));
          Alert.alert('Item Removed');
          console.log(res.data);
        });
    } else {
      let data1 = todos.filter(item => item.Id !== Id);
      setTodos(todos.filter(item => item.Id !== Id));
      removeData(data1);
    }
  };

  //share todo
  const share = Id => {
    todos.map(item => {
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

  console.log('Saved user ID ' + UserID);

  const addTodo = () => {
    setModalVisible(!modalVisible);
    console.log('CatID = ' + CATID + 'Catname= ' + Catname);

    if (Reach) {
      if (!todo) return;
      else {
        if (CATID != 'false') {
          axios
            .post(
              'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_add',
              {
                data: {
                  userid: UserID,
                  moduleid: 1,
                  catid: CATID,
                  catname: Catname,
                  name: 'Test',
                  notes: todo,
                  remind: 0,
                  reminds: '',
                  remindf: '',
                  status: 1,
                  date: Date.now(),
                },
              },
            )
            .then(response => {
              setTodos([
                ...todos,
                {
                  Id: response.data.data[0],
                  UserId: UserID,
                  ModuleId: 1,
                  Cat: '',
                  Catid: CATID,
                  Name: 'Test',
                  Notes: todo,
                  Status: 1,
                  remind: 0,
                  reminds: '',
                  remindf: '',
                  date: Date.now(),
                },
              ]);
            });

          setTodo('');
          //setCategory('');
        } else {
          // for catid false
          axios
            .post(
              'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_add',
              {
                data: {
                  userid: UserID,
                  moduleid: 1,
                  catid: CATID,
                  cat: Catname,
                  catcolor: '#FF0000',
                  caticon: '',
                  name: 'Test',
                  notess: todo,
                  remind: 0,
                  reminds: '',
                  remindf: '',
                  status: 1,
                  date: Date.now(),
                },
              },
            )
            .then(response => {
              setTodos([
                ...todos,
                {
                  Id: response.data.data[0],
                  UserId: UserID,
                  ModuleId: 1,
                  Cat: Catname,
                  Catid: CATID,
                  Name: 'Test',
                  Notes: todo,
                  Status: 1,
                  remind: 0,
                  reminds: '',
                  remindf: '',
                  date: Date.now(),
                },
              ]);
            });

          setTodo('');
          //setCategory('');
        }
      }
    } else {
      if (!todo) return;
      else {
        console.log(Catname);
        console.log(CATID);
        let data = [
          ...todos,
          {
            Id: uuid.v4(),
            UserId: UserID,
            ModuleId: 1,
            Cat: Catname,
            Catid: CATID,
            Name: 'Test',
            Notes: todo,
            Status: 1,
            remind: 0,
            reminds: '',
            remindf: '',
            date: Date.now(),
          },
        ];
        setTodos(data);
        setTodo('');
        //setCategory('');
        storeData(data);
      }
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

        // if (!UserID) {
        axios
          .post(
            'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/login',
            {
              data: {
                email: Email,
                socialid: Uid,
                fname: '',
                lname: '',
                gender: '',
                profile: '',
                status: '1',
                module_list: 'yes',
                cat_list: 'yes',
                ledger_list: 'yes',
              },
            },
          )
          .then(res => {
            setUserID(res.data.data.userid);
            let user = res.data.data.userid;

            if (Reach) {
              axios
                .post(
                  'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list',
                  {
                    data: {
                      //userid: UserID,
                      userid: user,
                      moduleid: 1,
                      catid: '',
                      favourite: '',
                      find: '',
                      order: 'x.CDate DESC',
                      limit: 100,
                    },
                  },
                )
                .then(function (res) {
                  //console.log(res.data);
                  const filled = res.data.data;
                  if (filled == false) {
                    //Alert.alert(res.data.msg);
                  } else {
                    setTodos(res.data.data);
                  }
                });
            }
          });
      }
    });

    subscribe();
  }, [UserID]);

  useEffect(() => {
    if (!Reach) {
      getData();
    }
  }, []);

  const onSelectSwitch = index => {
    //alert('Selected index: ' + index);
  };

  const RenderTray = () => {
    setTray(!Tray);
  };

  const Render = Id => {
    todos.map(item => {
      if (item.Id === Id && Tray) {
        console.log(Id);
        setRenderState(Id);
      }
    });
  };

  const markFavHandle = ({catId, status }) => {
    axios.post('https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_favourite', {
      data: {
        id:catId,
        userid:UserID,
        fav:status 
       }
    } ).then(response => {
      axios
      .post(
        'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list',
        {
          data: {
            //userid: UserID,
            userid: UserID,
            moduleid: 1,
            catid: '',
            favourite: '',
            find: '',
            order: 'x.CDate DESC',
            limit: 100,
          },
        },
      )
      .then(function (res) {
        //console.log(res.data);
        const filled = res.data.data;
        if (filled == false) {
          //Alert.alert(res.data.msg);
        } else {
          setTodos(res.data.data);
        }
      });
       console.log('marked fav')
    })
  }
  console.log('catid saved is ' + CATID);

  const favourite = Id => {
    setFav(!Fav);
    console.log('fav value is ' + Fav);

    axios
      .post(
        'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_favourite',
        {
          data: {
            id: Id,
            userid: UserID,
            fav: Fav,
          },
        },
      )
      .then(response => {
        axios
          .post(
            'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list',
            {
              data: {
                //userid: UserID,
                userid: UserID,
                moduleid: 1,
                catid: '',
                favourite: '',
                find: '',
                order: 'x.CDate DESC',
                limit: 100,
              },
            },
          )
          .then(function (res) {
            //console.log(res.data);
            const filled = res.data.data;
            if (filled == false) {
              //Alert.alert(res.data.msg);
            } else {
              setTodos(res.data.data);
            }
          });
        console.log('marked fav');
      });
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.heading}>Todos</Text>

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
        {todos.map(item => {
          if (edit) {
            return (
              <View
                style={styles.todo}
                //onPress={() => edittodo(item.Id, item.catid)}
              >
                <TouchableOpacity
                  onPress={() => {
                    favourite(item.Id);
                  }}
                  style={{
                    flexDirection: 'row',
                    height: 10,
                    marginTop: 20,
                    width: 350,
                  }}>
                  {Fav == 0 ? (
                    <Image
                      style={{
                        marginRight: 10,
                        marginTop: 0,
                        marginLeft: 315,
                        width: 35,
                        height: 35,
                        marginBottom: 20,
                        alignSelf: 'center',
                      }}
                      source={require('../assets/notfav.png')}
                    />
                  ) : (
                    <Image
                      style={{
                        marginRight: 10,
                        marginTop: 0,
                        marginLeft: 315,
                        width: 35,
                        height: 35,
                        marginBottom: 20,
                        alignSelf: 'center',
                      }}
                      source={require('../assets/fav.png')}
                    />
                  )}
                </TouchableOpacity>
                {/* </View> */}
                <View
                  style={{
                    paddingHorizontal: 5,
                    //flexDirection: 'row',
                    height: 50,
                    width: 350,
                  }}>
                  <Text style={styles.txt}>{item.Notes}</Text>
                </View>
                {/* Button Started */}
                <View style={styles.tray}>
                  <TouchableOpacity
                    name="Button tray"
                    size={24}
                    color="black"
                    onPress={() => {
                      Render(item.Id);
                    }}
                    onPressIn={() => {
                      RenderTray();
                    }}>
                    <Image
                      style={{
                        height: 35,
                        width: 35,
                        marginLeft: -15,
                        //marginTop: 15,
                        alignSelf: 'center',
                      }}
                      source={require('../assets/options.png')}
                    />
                  </TouchableOpacity>

                  {
                    //Render ? <View></View> : <View></View>}
                    item.Id == RenderState && Tray ? (
                      <View style={styles.todo1}>
                        <TouchableOpacity
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
                        </TouchableOpacity>
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
                          onPress={() => edittodo(item.Id)}>
                          <Image
                            style={styles.custom_button}
                            source={require('../assets/edit.png')}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          name="delete"
                          size={24}
                          color="black"
                          onPress={() => deletetodo(item.Id)}>
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
                        <CustomSwitch
                          selectionMode={1}
                          roundCorner={true}
                          option1={'Active'}
                          option2={'Done'}
                          onSelectSwitch={onSelectSwitch}
                          selectionColor={'green'}
                        />
                      </View>
                    ) : (
                      <View></View>
                    )
                  }
                </View>
              </View>
            );
          }
          if (!edit && item.Id === EditID) {
            return (
              <View style={styles.todo321}>
                <Text style={styles.txt321}>Category: {item.Cat}</Text>
                <TextInput
                  style={styles.inp321}
                  value={editText}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={text => setEditText(text)}
                />
                <View style={styles.todo1}>
                  <TouchableOpacity
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => edittodo(item.Id)}>
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
              <Text style={styles.modalText}>Enter a new Todo!! </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {todos.map(item => (
                  <View style={{flexDirection: 'row'}}>
                    <Text>{item.Cat}</Text>
                    <RadioButton
                      value="check"
                      status={Value === item.CatId ? 'checked' : 'unchecked'}
                      onPress={() => setValue(item.CatId)}
                      onPressIn={() => setCATID(String(item.CatId))}
                    />
                    <Text>{'\n'}</Text>
                  </View>
                ))}
                <Text>Add New Category</Text>
                <RadioButton
                  value="check"
                  status={Value === 1000 ? 'checked' : 'unchecked'}
                  onPress={() => setValue(1000)}
                  onPressIn={() => setCATID('false')}
                />
              </View>

              {Value == 1000 ? (
                <View>
                  <TextInput
                    style={styles.inp1}
                    placeholder="Add a new category"
                    onChangeText={text => setCatname(text)}></TextInput>
                </View>
              ) : null}

              <TextInput
                style={styles.inp1}
                onChangeText={text => setTodo(text)}
                placeholder="Enter the Todo"
              />

              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button123, styles.buttonClose]}
                  //onPress={() => setModalVisible(!modalVisible)}>
                  onPress={addTodo}
                  //</View>onPressIn={catadd}
                >
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
