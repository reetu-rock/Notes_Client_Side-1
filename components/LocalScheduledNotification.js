import React, {useState, useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar} from 'react-native-paper';

//import RemindCalendar from '../screens/RemindCalendar';
const LocalScheduledNotification = ({navigation, route}) => {
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [items, setItems] = useState({});
  const [DT, setDT] = useState('');
  const [AllNotifications, setAllNotifications] = useState([]);

  const showDatePicker = () => {
    setDateTimePickerVisible(true);
  };
  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
  };

  const handleConfirmDateTime = dateTime => {
    hideDateTimePicker();
    PushNotification.createChannel({
      channelId: 'Scheduled Channel', // (required)
      channelName: 'My Scheduled Channel', // (required)
    });
    PushNotification.localNotificationSchedule({
      channelId: 'Scheduled Channel',
      title: 'REMINDER',
      message: 'Reminder: ' + route.params.information,
      date: dateTime,
    });

    Alert.alert('Reminder Added ' + dateTime);

    // navigation.navigate('RemindCalendar', {
    //   DT: dateTime,
    //   info: route.params.information,
    // });
    setDT(dateTime);
  };

  const timeToString = time => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const loadItems = (RemindInfo, dateTimeinfo) => {
    let dateformat = format(dateTimeinfo);

    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        const time = Date.now() + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          if (strTime == dateformat) {
            setAllNotifications([
              ...AllNotifications,
              {DateTime: dateformat, information: RemindInfo},
            ]);
            items[strTime].push({
              name: 'Reminder: ' + RemindInfo + ' ,Time ' + dateTimeinfo, //.toTimeString(), //+ strTime,
              //height: 50, //Math.max(150),
            });
          } else {
            items[strTime].push({
              name: 'No Reminder',
            });
          }
        }
      }
    });
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

  const format = () => {
    var day = ('0' + new Date().getDate()).slice(-2);
    var month = ('0' + (new Date().getMonth() + 1)).slice(-2);
    var year = new Date().getFullYear();
    return year + '-' + month + '-' + day;
  };

  let dateTimeinfo = DT;
  let RemindInfo = route.params.information;
  console.log(AllNotifications);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          padding: 5,
          //flex: 1,
          display: 'flex',
          justifyContent: 'center',
          //alignItems: 'center',
        }}>
        <Button title="Select date & time" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={dateTimePickerVisible}
          mode="datetime"
          onConfirm={handleConfirmDateTime}
          onCancel={hideDateTimePicker}
        />
      </View>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems(RemindInfo, dateTimeinfo)}
        selected={format()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default LocalScheduledNotification;
