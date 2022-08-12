import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import DynamicTabView from 'react-native-dynamic-tab-view';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import IsReachable from '../components/IsReachable';
const HomeCategory = () => {
  const [Uid, setUid] = useState('');
  const [Email, setEmail] = useState('');
  const [UserID, setUserID] = useState(null);
  const [Reach, setReach] = useState(false);
  const [todos, setTodos] = useState([]);
  const [PhotoUrl, setPhotoUrl] = useState('');

  const server = async () => {
    const data = await IsReachable();
    console.log('data of server', data);
    setReach(data);
    console.log('data of setReach', Reach);
  };

  useEffect(() => {
    server();
  }, [Reach]);

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
                  moduleid: 3,
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
                setTodos(res.data.data);
              }
            });
        }
      }
    });

    subscribe();
  }, []);

  let CatNames = [];

  todos.map(item => {
    CatNames.push({Id: item.Id, title: item.Cat, notes: item.Notes});
  });

  console.log(CatNames);

  let result = [];

  try {
    CatNames.forEach(i => {
      const index = result.findIndex(item => item.title === i.title);
      if (index < 0) {
        result.push({Id: i.Id, title: i.title, notes: [i.notes]});
      } else {
        result[index].notes.push(i.notes);
      }
    });
  } catch (err) {
    ('error in fetching');
  }

  let data = result;
  console.log(result);
  // let data = CatNames;

  const defaultIndex = 0;

  const renderItem = i => {
    return (
      <View style={{flex: 1}}>
        {i.notes.map(item => (
          <Text>{item}</Text>
        ))}
      </View>
    );
  };

  const onChangeTab = index => {};
  return (
    <DynamicTabView
      data={data}
      renderTab={renderItem}
      defaultIndex={defaultIndex}
      containerStyle={styles.container}
      headerBackgroundColor={'white'}
      headerTextStyle={styles.headerText}
      onChangeTab={onChangeTab}
      headerUnderlayColor={'blue'}
    />
  );
};

export default HomeCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 16,
  },
  headerText: {
    color: 'black',
  },
  tabItemContainer: {
    backgroundColor: '#cf6bab',
  },
});
