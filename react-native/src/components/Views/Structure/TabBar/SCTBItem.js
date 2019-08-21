import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
 } from 'react-native';

const assetDir = '../../../../../assets';


export default class TBItem extends React.Component {

  //
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const { selected, imageIconSrc, notificationCount } = this.props;

    let indicator = { };
    let selectedIndicator = { };
    if (selected) {
      indicator = { borderWidth: 1.5 };
      selectedIndicator = { width: 35, height: 35 };
    }

    let notification;
    if (notificationCount != undefined && notificationCount != null && notificationCount > 0) {
      notification = (
        <View style={styles.notificationCountContainer}>
          <Text style={styles.notificationCountText}>{notificationCount}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[styles.container, indicator]} onPress={() => {
        this.props.onPress.func(this.props.onPress.prevSelected, this.props.onPress.selected);
      }}>
          <Image style={[styles.imageIcon, selectedIndicator]} source={imageIconSrc} />
          { notification }
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderTopColor: '#808284',
    borderRadius: 3,
  },

  imageIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },

  notificationCountContainer: {

    position: 'absolute',
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    right: 15,
    top: 15,
  },

  notificationCountText: {

    color: '#FFFFFF',
  },

});
