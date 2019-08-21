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
import Rating from '../../../../../../src/components/Views/Structure/Widgets/Rating';

export default class LVListImageItem extends React.Component {

  //
  constructor(props) {
    super(props);

    this.state = {

    };

    this.segueRightIconComponent.bind(this);
  }

  // Custom components
  segueRightIconComponent()
  {
    if(this.props.hasSegue)
    {
      return <Image style={styles.segueIcon} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
    }
    else {
      return <View style={styles.segueIconPlaceHolder} ></View>
    }
  }


  render() {

    const { separator } = this.props;
    let { options, opacity } = this.props;
    options = (options ? options : {});

    let separatorBorder = {};
    if (separator) {
      separatorBorder = { borderBottomWidth: 0.5, borderBottomColor:'#CFDAE0' };
    }

    if (opacity == undefined || opacity == null) {
      opacity = 0.2;
    }
    

    return (
      <TouchableOpacity style={[styles.container, separatorBorder, options.container]} onPress={this.props.onPress} activeOpacity={opacity}>
        <View style={styles.rowWrapper}>
          <Image style={[styles.image, options.image]} source={this.props.image} />
          <View style={styles.contentColumnWrapper}>
            <Text style={[styles.title, options.title]}>{this.props.title}</Text>
          </View>
          { this.segueRightIconComponent() }
        </View>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },

  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  contentColumnWrapper: {
    flex: 1,
    justifyContent: 'center',
  },


  title: {
  },

  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },

  segueIcon: {
    width: 10,
    resizeMode: 'contain',
  },

  segueIconPlaceHolder: {
  },
});
