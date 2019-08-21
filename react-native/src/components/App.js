/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import SplashScreen from 'react-native-splash-screen';

import Main from '../../src/components/Controllers/RootController';


export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Main />
    );
  }
}
