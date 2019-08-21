import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  Text,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
 } from 'react-native';


const assetDir = '../../../../assets';

import LVDishItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVDishItem';
import LVListItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListItem';
import LVInputItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVInputItem';
import LVList from '../../../../src/components/Views/Structure/Lists/SCLVList';

import Validator from '../../../../src/util/validator.js';
import Global from '../../../../src/global.js'
import Debug from '../../../../src/util/debug.js';
import User from '../../../../src/modals/user/user.js';
import Dish from '../../../../src/modals/menu/dish/dish.js';


export default class HomeFeed extends React.Component {

  //Funcs
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

    const { user, dishes } = props.user;
    Dish.getDish(user, dishes).then(({loaded, state}) => {

      let listItems = [];
      if(state != null)
      {
        listItems = state;
      }
      else if(loaded != null)
      {
        // Set list items
        for(let key in loaded)
        {
          let dishes = [];
          const items = loaded[key];
          for(let index in items)
          {
            const dish = items[index];
            dishes.push({
              component: (options) => { return (
                <LVDishItem 
                  dish={dish} 
                  separator={true} 
                  onPress={() => {
                    // On item selection
                    // Segue to order details page
                    this.props.navigate('PCDishDetails', { 
                      user: this.props.user, 
                      dish: dish, 
                      screenProps: this.props.screenProps, 
                      saveToState: this.props.saveToState,
                    });
                  }} 
                  options={{...options}} /> 
              )}
            });
          }

          listItems.push({
            dishes: dishes,
            component: (options) => { return (
              <LVList 
                listItems={dishes} 
                pagingEnabled={true} 
                horizontal={true} 
                scrollEnabled={true} 
                options={{...options}} /> 
            )}
          });
        }

        if(listItems.length > 0)
        {
          // Recreate first & last item to add marginBottom in list
          const item = listItems[listItems.length-1];
          listItems[listItems.length-1] = {
            dishes: item.dishes,
            component: (options) => { return (
              <LVList 
                listItems={item.dishes} 
                pagingEnabled={true} 
                horizontal={true} 
                scrollEnabled={true} 
                options={{...options, container:{ ...options.container, marginBottom: 170, }}} /> 
            )}
          }

          //Set dishes to this.state
          this.props.saveToState('home', listItems);
        }
      }

      this.setState({
        listItems: listItems,
      });

    });


    this.state = {
      listItems: [],
      refreshState: 0,
    };

    this.resetState.bind(this);
  }

  render() {

    var { options } = this.props;
    options = (options ? options : {});

    return (
      <View style={[styles.container, options.container]}>
        <StatusBar barStyle="light-content" />
        <FlatList key={this.state.refreshState} ref={scrollView => { this._flatList = scrollView; }} style={styles.flatlist} data={this.state.listItems} renderItem={({item}) => {

          return (
            item.component({})
          );
        }} showsVerticalScrollIndicator={false} keyExtractor={(item, index) => index.toString()} />
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  flatlist: {
    paddingTop: 70,
  },


});
