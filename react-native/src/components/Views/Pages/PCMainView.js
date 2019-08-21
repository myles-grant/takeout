import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
 } from 'react-native';


const assetDir = '../../../../assets';


export default class LVMainView extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    let { options } = this.props;
    options = (options ? options : {});

    return (
      <View style={[styles.container, options.container]}>
        <StatusBar barStyle={(Platform.OS == 'ios' ? "dark-content" : "light-content")} />
        <View style={styles.s1}>
          <Image style={styles.logo} source={require(assetDir + "/images/logo/logo.png")} />
        </View>
        <View style={styles.s2}>
          <View style={styles.s2_1}>
            <TouchableOpacity style={[styles.buttonWrapper, { backgroundColor: '#E9333D' }]} onPress={() => {
                this.props.navigation.navigate('LVUserRole', { bgColor: { backgroundColor: '#E9333D' }, dest:'LVLogin' })
              }}>
              <Text style={styles.button}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonWrapper, { backgroundColor: '#8AB560' }]} onPress={() => {
                this.props.navigation.navigate('LVUserRole', { bgColor: { backgroundColor: '#8AB560' }, dest:'LVSignup' })
            }}>
              <Text style={styles.button}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FFFFFF',
  },

  s1: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },


  logo: {
    width: 225,
    resizeMode: 'contain',
  },

  s2: {
    flex: 2,
  },

  s2_1: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },


  buttonWrapper: {
    flex: 1,
    margin: 9,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    color: '#FFFFFF',
  },

});
