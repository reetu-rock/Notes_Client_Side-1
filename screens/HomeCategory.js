import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DynamicTabView from 'react-native-dynamic-tab-view';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import IsReachable from '../components/IsReachable';
import styles from '../components/styles';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
import {RadioButton} from 'react-native-paper';
import CustomSwitch from '../components/CustomSwitch';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import SearchBar from 'react-native-dynamic-search-bar';
import HighlightText from '@sanar/react-native-highlight-text';

const HomeCategory = () => {
  const navigation = useNavigation();
  const [Uid, setUid] = useState('');
  const [Email, setEmail] = useState('');
  const [UserID, setUserID] = useState(null);
  const [todo, setTodo] = useState('');
  const [Reach, setReach] = useState(false);
  const [todos, setTodos] = useState([]);
  const [PhotoUrl, setPhotoUrl] = useState('');
  const [EditID, setEditID] = useState('');
  const [editText, setEditText] = useState('');
  const [edit, setEdit] = useState(true);
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [RemindData, setRemindData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Value, setValue] = useState(1);
  const [Catname, setCatname] = useState('');
  const [CATID, setCATID] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [RenderState, setRenderState] = useState(null);
  const [Tray, setTray] = useState(false);
  const [Fav, setFav] = useState(false);
  const [Search, setSearch] = useState('');

  // const storeData = async todos => {
  //   try {
  //     const jsonValue = JSON.stringify(todos);
  //     await AsyncStorage.setItem('todos', jsonValue);
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('todos');
  //     return jsonValue != null ? setTodos(JSON.parse(jsonValue)) : null;
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  // const removeData = async todos => {
  //   try {
  //     const jsonValue = JSON.stringify(todos);
  //     await AsyncStorage.setItem('todos', jsonValue);
  //   } catch (e) {
  //     // saving error
  //   }
  //   Alert.alert('Item Removed');
  // };

  // const editData = async todos => {
  //   try {
  //     const jsonValue = JSON.stringify(todos);
  //     await AsyncStorage.setItem('todos', jsonValue);
  //   } catch (e) {
  //     // saving error
  //   }
  //   Alert.alert('Item Edited');
  // };

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
  const edittodo = Id => {
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
            axios
              .post(
                'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list',
                {
                  data: {
                    //userid: UserID,
                    userid: UserID,
                    moduleid: 1,
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
            console.log('ledger edited');
          });
      }

      // else {
      //   let data2 = todos.map(item =>
      //     item.Id === Id
      //       ? {
      //           Id: item.Id,
      //           UserId: UserID,
      //           ModuleId: 1,
      //           Cat: item.Cat,
      //           CatId: CATID,
      //           Name: 'Test',
      //           Notes: editText,
      //           Status: 1,
      //           remind: 0,
      //           reminds: '',
      //           remindf: '',
      //           date: Date.now(),
      //         }
      //       : item,
      //   );
      //   setEditText('');
      //   setTodos(data2);
      //   editData(data2);
      // }

      setEdit(true);
    }

    setTray(false);
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
                  status: 1,
                },
              },
            )
            .then(function (res) {
              setTodos(res.data.data);
            });
          console.log('ledger deleted');
        });
    }

    setTray(false);
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
    setTray(false);
  };

  const onShare = information => {
    let options = {
      title: 'Awesome Contents',
      message: information,
      //url: 'https://www.mail-signatures.com/wp-content/uploads/2019/02/How-to-find-direct-link-to-image_Blog-Picture.png',
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

    // axios.post('http://10.0.2.2:5000/createrem/', {
    //   id: uuid.v4(),
    //   guid: Uid,
    //   info: RemindData,
    //   timedate: dateTime,
    // });

    setTray(false);
  };
  // console.log('Saved user ID in Test ' + UserID);

  //Adding modified todo

  const addTodo = () => {
    setModalVisible(!modalVisible);

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
                  cat: Catname,
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
              axios
                .post(
                  'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list',
                  {
                    data: {
                      //userid: UserID,
                      userid: UserID,
                      moduleid: 1,
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
              console.log('added ledger');
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
              axios
                .post(
                  'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list',
                  {
                    data: {
                      //userid: UserID,
                      userid: UserID,
                      moduleid: 1,
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

          setTodo('');
          //setCategory('');
        }
      }
    }
    // else {
    //   if (!todo) return;
    //   else {
    //     console.log(Catname);
    //     console.log(CATID);
    //     let data = [
    //       ...todos,
    //       {
    //         Id: uuid.v4(),
    //         UserId: UserID,
    //         ModuleId: 1,
    //         Cat: Catname,
    //         CatId: CATID,
    //         Name: 'Test',
    //         Notes: todo,
    //         Status: 1,
    //         remind: 0,
    //         reminds: '',
    //         remindf: '',
    //         date: Date.now(),
    //       },
    //     ];
    //     setTodos(data);
    //     setTodo('');
    //     //setCategory('');
    //     storeData(data);
    //   }
    // }
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

  // useEffect(() => {
  //   if (!Reach) {
  //     getData();
  //   }
  // }, []);

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

  const favourite = item => {
    setFav(!Fav);
    axios
      .post(
        'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_favourite',
        {
          data: {
            id: item.Id,
            userid: UserID,
            fav: !item.Favourite,
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

  let CatNames = [];

  todos.map(item => {
    CatNames.push({
      Id: item.Id,
      title: item.Cat,
      notes: item.Notes,
      CatId: item.CatId,
      Favourite: item.Favourite,
    });
  });

  console.log('These are Catnames ' + CatNames);

  let result = [];
  let recents = [];
  let favorites = [];

  try {
    CatNames.forEach(i => {
      const index1 = result.findIndex(item => item.title === i.title);
      const index2 = recents.findIndex(item => item.title === 'Recents');
      const index3 = favorites.findIndex(item => item.title === 'Favorites');
      if (index1 < 0) {
        result.push({
          title: i.title,
          data: [{Id: i.Id, notes: i.notes, Favourite: i.Favourite}],
          CatId: i.CatId,
        });
      } else {
        result[index1].data.push({
          Id: i.Id,
          notes: i.notes,
          Favourite: i.Favourite,
        });
      }
      if (index2 < 0) {
        recents.push({
          title: 'Recents',
          data: [{Id: i.Id, notes: i.notes, Favourite: i.Favourite}],
          CatId: i.CatId,
        });
      } else {
        recents[index2].data.push({
          Id: i.Id,
          notes: i.notes,
          Favourite: i.Favourite,
        });
      }

      if (i.Favourite) {
        if (index3 < 0) {
          favorites.push({
            title: 'Favorites',
            data: [{Id: i.Id, notes: i.notes, Favourite: i.Favourite}],
            CatId: i.CatId,
          });
        } else {
          favorites[index3].data.push({
            Id: i.Id,
            notes: i.notes,
            Favourite: i.Favourite,
          });
        }
      }
    });
  } catch (err) {
    ('error in fetching');
  }

  //let data1 = [{title: ''}, ...recents, ...favorites, ...result];
  let data = [{title: '', data: []}, ...recents, ...favorites, ...result];

  console.log(result);

  const defaultIndex = 0;

  const renderItem = i => {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.heading}>Notes</Text>

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
                    height: 50,
                    borderRadius: 50,
                    width: 50,
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
          {/* <TouchableOpacity></TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => setModalVisible1(true)}
            style={{marginLeft: 230}}>
            <Image
              style={{
                height: 45,
                borderRadius: 50,
                width: 45,
                marginTop: 5,
                marginBottom: 5,
              }}
              source={{
                uri: PhotoUrl,
              }}
            />
          </TouchableOpacity>
        </View>
        <SearchBar
          placeholder="Search here"
          //onPress={() => Alert.alert('onPress')}
          onChangeText={text => setSearch(text)}
          onSearchPress={Keyboard.dismiss}
          onClearPress={() => setSearch('')}
          backgroundColor="#ffff"
        />
        <ScrollView style={styles.scrollView}>
          {i.data.map(item => {
            if (edit) {
              return (
                <TouchableOpacity
                  style={styles.todo}
                  onPress={() => edittodo(item.Id, item.CatId)}>
                  <TouchableOpacity
                    onPress={() => {
                      favourite(item);
                    }}
                    style={{
                      flexDirection: 'row',
                      height: 10,
                      marginTop: 20,
                      width: 350,
                    }}>
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
                      source={
                        item.Favourite
                          ? require('../assets/fav.png')
                          : require('../assets/notfav.png')
                      }
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      paddingHorizontal: 5,
                      //flexDirection: 'row',
                      height: 40,
                      width: 350,
                    }}>
                    <HighlightText
                      highlightStyle={{backgroundColor: 'yellow'}}
                      searchWords={[Search]}
                      style={{fontWeight: 'bold', fontSize: 20, color: 'black'}}
                      textToHighlight={item.notes}
                    />
                    {/* <Text style={styles.txt}>{item.notes}</Text> */}
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
                          marginTop: 15,
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
                              Picker(item.notes);
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
                </TouchableOpacity>
              );
            }
            if (!edit && item.Id === EditID) {
              return (
                <View style={styles.todo321}>
                  {/* <Text style={styles.txt321}>Category: {item.title}</Text> */}
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

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter a new Todo!! </Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {result.map(item => (
                    <View style={{flexDirection: 'row', alignSelf: 'auto'}}>
                      <RadioButton
                        value="check"
                        status={Value === item.CatId ? 'checked' : 'unchecked'}
                        onPress={() => setValue(item.CatId)}
                        onPressIn={() => setCATID(String(item.CatId))}
                      />
                      <Text style={{marginTop: 7, color: 'black'}}>
                        {item.title}
                      </Text>
                      <Text>{'\n'}</Text>
                    </View>
                  ))}

                  <View style={{flexDirection: 'row', alignSelf: 'auto'}}>
                    <RadioButton
                      value="check"
                      status={Value === 1000 ? 'checked' : 'unchecked'}
                      onPress={() => setValue(1000)}
                      onPressIn={() => setCATID('false')}
                    />
                    <Text style={{marginTop: 7, color: 'black'}}>
                      Add New Category
                    </Text>
                  </View>
                </View>

                {Value == 1000 ? (
                  <View>
                    <TextInput
                      placeholderTextColor="black"
                      style={styles.inp1}
                      placeholder="Add a new category"
                      onChangeText={text => setCatname(text)}></TextInput>
                  </View>
                ) : null}

                <TextInput
                  placeholderTextColor="black"
                  style={styles.inp1}
                  onChangeText={text => setTodo(text)}
                  placeholder="Enter the Todo"
                />

                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={[styles.button123, styles.buttonClose]}
                    onPress={addTodo}>
                    <Text style={styles.textStyle}>Save It!!</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button123, styles.buttonClose]}
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
  const onChangeTab = index => {};
  return (
    <DynamicTabView
      data={data}
      renderTab={renderItem}
      defaultIndex={defaultIndex}
      containerStyle={styles.container_cat}
      headerBackgroundColor={'white'}
      headerTextStyle={styles.headerText}
      onChangeTab={onChangeTab}
      headerUnderlayColor={'blue'}
    />
  );
};

export default HomeCategory;
