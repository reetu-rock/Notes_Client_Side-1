import * as React from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Home from '../components/Home';
import Notes from '../components/Notes';
import Document from './Document';
import RemindCalendar from './RemindCalendar';
import HomeCategory from './HomeCategory';
//import Maps from './Maps';

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Notes'},
    //{key: 'second', title: 'Notes'},
    //{key: 'third', title: 'Docs'},
    //{key: 'fourth', title: 'Reminder'},
    //{key: 'fifth', title: 'test'},
    //{key: 'fifth', title: 'Maps'},
  ]);

  const renderScene = SceneMap({
    first: HomeCategory,
    //second: Notes,
    //third: Document,
    //fourth: RemindCalendar,
    //fifth: HomeCategory,
    //fifth: Maps,
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
