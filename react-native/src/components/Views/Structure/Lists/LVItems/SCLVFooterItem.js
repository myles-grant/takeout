import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const assetDir = '../../../../../../assets';

export default class LVFooterItem extends React.Component {

  //
  constructor(props) {
    super(props);

  }

  render() {

    const { separator } = this.props;
    let { options } = this.props;
    options = (options ? options : {});

    let separatorBorder = {};
    if (separator) {
      separatorBorder = { borderTopWidth: 0.5, borderTopColor: '#CFDAE0' };
    }

    return (
      <View style={[styles.container, separatorBorder, options.container]}>
        <Text style={styles.copyright}>{this.props.copyright}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  copyright: {
    color: '#D1D2D4',
  },

});
