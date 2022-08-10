import * as React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Home from '../components/Home';
import Notes from '../components/Notes';
import Document from './Document';
import RemindCalendar from './RemindCalendar';
//import Maps from './Maps';

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Todos'},
    {key: 'second', title: 'Notes'},
    {key: 'third', title: 'Docs'},
    {key: 'fourth', title: 'Reminder'},
    // {key: 'fifth', title: 'Maps'},
  ]);

  const renderScene = SceneMap({
    first: Home,
    second: Notes,
    third: Document,
    fourth: RemindCalendar,
    // fifth: Maps,
  });

  return (
    <TabView
      //style={{padding: 5}}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
}
