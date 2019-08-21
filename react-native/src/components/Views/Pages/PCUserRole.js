import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';


const assetDir = '../../../../assets';

export default class LVUserRole extends React.Component {

  static navigationOptions(props) {

    const { bgColor } = props.navigation.state.params;
    return {
      headerStyle: {
        backgroundColor: bgColor.backgroundColor,
        borderBottomWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: '#FFFFFF',
    };
  };

  //
  constructor(props) {
    super(props);
  }

  render() {
    let { options } = this.props;
    const { bgColor, dest } = this.props.navigation.state.params;
    options = (options ? options : {});

    return (
      <View style={[styles.container, bgColor, options.container]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.s1}>
          <Image style={styles.logo} source={require(assetDir + "/images/logo-white-full/logo-white-full.png")} />
        </View>
        <View style={styles.s2}>
          <View style={styles.s2_1}>
            <TouchableOpacity 
              style={[
                styles.buttonWrapper, 
                bgColor
              ]} 
              onPress={() => {
                this.props.navigation.navigate(
                  dest, 
                  { 
                    bgColor: { backgroundColor : '#F48666' },
                    role: 'customer',
                  }
                );
              }}>
                <Text style={[styles.button, {color:'#FFFFFF'}]} >ORDER</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.buttonWrapper, 
                { backgroundColor: '#FFFFFF' }
              ]} 
              onPress={() => {
                this.props.navigation.navigate(
                  dest,
                  { 
                    bgColor : { backgroundColor : '#F16522' },
                    role: 'chef', 
                  }
                );
              }}>
              <Text style={[styles.button, {color:bgColor.backgroundColor}]}>CHEF</Text>
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
  },

  buttonWrapper: {
    height: 55,
    marginTop: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },

  button: {
    fontSize: 18,
  },

});
