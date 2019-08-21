import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
 } from 'react-native';


const assetDir = '../../../../assets';

export default class Splash extends React.Component {

  render() {
    let { options } = this.props;
    options = (options ? options : {});
    
    return (
      <View style={[styles.container, options.container]}>
        <StatusBar barStyle='dark-content' />
        <Image style={styles.logo} source={require(assetDir + "/images/logo/logo.png")} />
        <ActivityIndicator style={styles.spinner} size="large" color="#2B3990" />
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 240,
    resizeMode: 'contain',
  },

  spinner: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

});
