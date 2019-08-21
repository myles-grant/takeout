import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
 } from 'react-native';


const assetDir = '../../../../../assets';

export default class LVList extends React.Component {


  //
  resetState = () => {

    this.setState((prevState) => {
      return {
        refreshState: prevState.refreshState + 1,
      };
    });
  }


  //
  constructor(props) {
    super(props);

    this.state = {
      refreshState: 0,
    };

    this.resetState.bind(this);
  }

  render() {
    const { options } = this.props;
    return (
      <View style={[styles.container, options.container]}>
        <FlatList 
          key={this.state.refreshState} 
          ref={scrollView => { this._flatList = scrollView; }} 
          style={[styles.flatlist, options.flatlist]} 
          data={this.props.listItems} renderItem={({item}) => {

            return (
              item.component({})
            );
          }} 
          showsVerticalScrollIndicator={false} 
          showsHorizontalScrollIndicator={false} 
          pagingEnabled={this.props.pagingEnabled} 
          horizontal={this.props.horizontal} 
          scrollEnabled={this.props.scrollEnabled}  
          keyExtractor={(item, index) => index.toString()}   />
      <View style={styles.scrollIndicatorContainer}>
          {
            this.props.listItems.map((item, index, array) => {
              return (
                  <View key={index} style={styles.indicatorUnActive}>
                  </View>
              );
            })
          }
        </View>
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

  flatlist: {
    marginBottom: 15,
  },

  scrollIndicatorContainer: {

  },

  indicatorActive: {

  },

  indicatorUnActive: {

  },

});
