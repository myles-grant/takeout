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


export default class LVListItem extends React.Component {

  //
  constructor(props) {
    super(props);

    this.state = {

    };

    this.segueRightIconComponent.bind(this);
  }

  // Custom components
  segueRightIconComponent(options) {
    if (this.props.hasSegue) {
      return (<Image style={[styles.segueIcon, options.segueIcon]} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />);
    }

    return (<View style={styles.segueIconPlaceHolder} />);
  }


  render() {
    const { separator } = this.props;
    let { options, opacity } = this.props;
    options = (options ? options : {});

    let separatorBorder = {};
    if (separator) {
      separatorBorder = { borderBottomWidth: 0.5, borderBottomColor: '#CFDAE0' };
    }

    if (opacity == undefined || opacity == null) {
      opacity = 0.2;
    }
    
    return (
      <TouchableOpacity style={[styles.container, separatorBorder, options.container]} onPress={this.props.onPress} activeOpacity={opacity}>
        <View style={styles.rowWrapper}>
          <View style={styles.contentColumnWrapper}>
            <Text style={[styles.title, options.title]}>{this.props.title}</Text>
          </View>
          { this.segueRightIconComponent(options) }
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
  },

  contentColumnWrapper: {
    flex: 1,
  },


  title: {
    flex: 1,
  },

  segueIcon: {
    width: 10,
    resizeMode: 'contain',
  },

  segueIconPlaceHolder: {
  },
});
