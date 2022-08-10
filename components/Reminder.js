import React, {useState} from 'react';
import {SafeAreaView, View, Text, Button} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
//import LocalNotification from './LocalNotification';

const Reminder = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirmDate = date => {
    setSelectedDate(date);
    console.log(selectedDate.toDateString());
    hideDatePicker();
  };
  const handleConfirmTime = time => {
    setSelectedTime(time);
    console.log(selectedTime.toTimeString());
    hideTimePicker();
  };

  const LocalNotificationUnscheduled = () => {
    PushNotification.createChannel({
      channelId: 'Unscheduled Channel', // (required)
      channelName: 'My Unscheduled Channel', // (required)
    });
    PushNotification.localNotification({
      channelId: 'Unscheduled Channel',
      title: 'An unscheduled local notification created',
      message: 'Local Notification',
      bigtext: 'This is a big text for unscheduled notification',
    });
  };

  const LocalNotificationScheduled = () => {
    PushNotification.createChannel({
      channelId: 'Scheduled Channel', // (required)
      channelName: 'My Scheduled Channel', // (required)
    });

    PushNotification.localNotificationSchedule({
      channelId: 'Scheduled Channel',
      title: 'A scheduled local notification created',
      message: 'Scheduled Local Notification',
      bigtext: 'This is a big text for scheduled notification',
      date: new Date(Date.now() + 10 * 1000),
    });
    console.log(new Date(Date.now()));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          padding: 20,
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
          {selectedDate ? selectedDate.toDateString() : 'No date selected'}
        </Text>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
          {selectedTime ? selectedTime.toTimeString() : 'No time selected'}
        </Text>
        <Button title="Select a date" onPress={showDatePicker} />
        <DateTimePickerModal
          date={selectedDate}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
        <Text>{'\n'}</Text>

        <Button title="Select a time" onPress={showTimePicker} />
        <DateTimePickerModal
          time={selectedTime}
          isVisible={timePickerVisible}
          mode="time"
          is24Hour={true}
          locale="en_GB"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
        />
        <Text>{'\n'}</Text>

        <Button
          title="Local Unscheduled Notification"
          onPress={LocalNotificationUnscheduled}
        />
        <Text>{'\n'}</Text>

        <Button
          title="Local Scheduled Notification"
          onPress={LocalNotificationScheduled}
        />
      </View>
    </SafeAreaView>
  );
};

export default Reminder;
