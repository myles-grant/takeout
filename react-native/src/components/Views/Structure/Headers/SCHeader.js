import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  Text,
 } from 'react-native';

const assetDir = '../../../../../assets';

import Global from '../../../../../src/global.js';
import Validator from '../../../../../src/util/validator.js';

export default class Header extends React.Component {



  //
  constructor(props) {
    super(props);


  }

  render() {
    const { options } = this.props;

    return (
      <View style={[styles.container, options.container]}>

      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'red',
  }

});
