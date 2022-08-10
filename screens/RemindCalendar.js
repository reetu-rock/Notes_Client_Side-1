import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const RemindCalendar = () => {
  const [AllNotifications, setAllNotifications] = useState([]);
  //const items = {};
  const [items, setItems] = useState({});

  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(user => {
      var googleuid = user.uid;
      axios
        .get(`http://10.0.2.2:5000/getrem`, {
          params: {
            guid: googleuid,
          },
        })
        .then(function (response) {
          setAllNotifications(response.data);
          console.log(AllNotifications);
        });
    });

    subscribe();
  }, []);

  const loadItems = () => {
    // setTimeout(() => {
    AllNotifications.map(item => {
      let serverdate = item.timedate.split('T')[0];
      items[serverdate] = [];
      items[serverdate].push({
        name: 'Time: ' + item.timedate + item.info,
      });
    });
    // });
  };

  const renderItem = item => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{item.name}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  let dateTimeinfo = new Date();

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={dateTimeinfo}
        renderItem={renderItem}
      />
    </View>
  );
};
export default RemindCalendar;
