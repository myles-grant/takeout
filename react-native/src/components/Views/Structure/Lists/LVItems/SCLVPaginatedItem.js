import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
 } from 'react-native';

const assetDir = '../../../../../../assets';

import Global from '../../../../../../src/global.js';
import Debug from '../../../../../../src/util/debug.js';

export default class LVPaginatedItem extends React.Component {

  //
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      secure: props.secure,
    };

    this.nextPageIconComponent.bind(this);
    this.prevPageIconComponent.bind(this);
  }

  //Custom components
  nextPageIconComponent()
  {
    if(this.props.nextPage != false)
    {
      if(this.props.nextEnabled) {
        return (
          <TouchableOpacity style={styles.nextPageWrapper} onPress={this.props.nextPage.onPress}>
            <Text style={styles.nextPageText}>{this.props.nextPage.title}</Text>
            <Image style={styles.segueIcon} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
          </TouchableOpacity>
        );
      }
      else{
        return (
          <View style={styles.nextPageWrapper}>
            <Text style={[styles.nextPageText, {color:'#D1D2D4'}]}>{this.props.nextPage.title}</Text>
            <Image style={[styles.segueIcon, {tintColor:'#D1D2D4'}]} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
          </View>
        );
      }
    }
    else {
      return <View style={styles.segueIconPlaceHolder} ></View>
    }
  }

  prevPageIconComponent()
  {
    if(this.props.prevPage != false)
    {
      if(this.props.prevEnabled) {
        return (
          <TouchableOpacity style={styles.prevPageWrapper} onPress={this.props.prevPage.onPress}>
            <Image style={styles.segueIcon} source={require(assetDir + '/images/segue-left-icon/segue-left-icon.png')} />
            <Text style={styles.prevPageText}>{this.props.prevPage.title}</Text>
          </TouchableOpacity>
        );
      }
      else {
        return (
          <View style={styles.prevPageWrapper}>
            <Image style={[styles.segueIcon, {tintColor:'#D1D2D4'}]} source={require(assetDir + '/images/segue-left-icon/segue-left-icon.png')} />
            <Text style={[styles.prevPageText, {color:'#D1D2D4'}]}>{this.props.prevPage.title}</Text>
          </View>
        );
      }
    }
    else {
      return <View style={styles.segueIconPlaceHolder} ></View>
    }
  }


  render() {

    const { separator } = this.props;
    let { options } = this.props;
    options = (options ? options : {});

    let separatorBorder = {};
    if (separator) {
      separatorBorder = { borderTopWidth: 0.5, borderTopColor:'#CFDAE0' };
    }

    return (
      <View style={[styles.container, separatorBorder, options.container]}>
        <View style={styles.rowWrapper}>
          { this.prevPageIconComponent() }
          { this.nextPageIconComponent() }
        </View>
      </View>
    );
  }
}


const _debugMode = false;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: Debug.layoutColor(_debugMode, '', 1),
  },

  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Debug.layoutColor(_debugMode, '', 2),
  },

  nextPageWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Debug.layoutColor(_debugMode, '', 4),
  },

  nextPageText: {
    color: '#1D9BF6',
    paddingTop: 6,
    backgroundColor: Debug.layoutColor(_debugMode, '', 7),
  },

  prevPageWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Debug.layoutColor(_debugMode, '', 5),
  },

  prevPageText: {
    color: '#1D9BF6',
    paddingTop: 6,
    backgroundColor: Debug.layoutColor(_debugMode, '', 8),
  },

  segueIcon: {
    width: 10,
    resizeMode: 'contain',
    backgroundColor: Debug.layoutColor(_debugMode, '', 3),
    tintColor: '#1D9BF6',
    alignSelf: 'flex-end',
  },

  segueIconPlaceHolder: {
    backgroundColor: Debug.layoutColor(_debugMode, '', 6),
  },
});
