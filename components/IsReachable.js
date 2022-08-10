import {LogBox} from 'react-native';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
let controller = new AbortController();

const IsReachable = async () => {
  let controller = new AbortController();
  setTimeout(() => controller.abort(), 1000);
  let result;

  try {
    //await fetch('https://www.google.co.in', {
    await fetch(
      'https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/77/test',
      //'https://www.schoolwise123.in/apimobile/notewise/depot/walnut/hRs6/77/test',
      {
        signal: controller.signal,
      },
    ).then(response => {
      if (response.ok) {
        result = true;
      }
    });
  } catch (err) {
    result = false;
  }
  return result;
};
export default IsReachable;
