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
import Order from '../../../../src/modals/order/order.js';


export default class Cart extends React.Component {

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

    console.log('***| PCCART');
    const { user, role, orders } = props;
    Order.getOrder(user, orders, role).then(({loaded, state}) => {

      let listItems = [];
      if(state != null)
      {
        listItems = state;
      }
      else if(loaded != null)
      {
        // Set items
        for(let key in loaded)
        {
          let orders = [];
          const items = loaded[key];
          for(let index in items)
          {
            const order = items[index];
            orders.push({
              order: order,
              component: (options) => { return (
                <View style={[styles.cartOrderContainer, options.container]}>
                  <LVDishItem 
                    dish={order.menu.dish} 
                    separator={true} 
                    options={{
                      ...options, 
                      container:{...options.container, marginBottom: 0}, 
                      image:{ width: styles.cartOrderContainer.width-4 },
                      chefInfoContainer: { paddingTop: 10 },
                    }}
                    opacity={1.0} 
                   />
                </View> );
              }
            });
          }

          listItems.push({
            orders: orders,
            component: (options) => { return (
              <View>
                <LVList 
                  listItems={orders} 
                  pagingEnabled={true} 
                  horizontal={true} 
                  scrollEnabled={true} 
                  options={{...options, flatlist:{marginBottom: 0}}} /> 
                <LVListItem 
                  title={'Checkout'} 
                  onPress={() => {
                    // On item selection
                    // Segue to order details page
                    // console.log('***| CHECKOUT DISH: ', JSON.stringify(dish));
                    this.props.navigate('PCOrderDetails', { 
                      user: this.props.user,
                      orders: orders, 
                      screenProps: this.props.screenProps, 
                      saveToState: this.props.saveToState,
                    });
                  }} 
                  separator={false} 
                  hasSegue={false} 
                  options={{...options, 
                    container:{...styles.checkoutButton}, 
                    title: {...styles.checkoutText, alignSelf:'center'} 
                  }} 
                  user={user} />
              </View>
            )}
          });
        }

        if(listItems.length > 0)
        {
          // Recreate first & last item to add marginBottom in list
          const item = listItems[listItems.length-1];
          listItems[listItems.length-1] = {
            orders: item.orders,
            component: (options) => { return (
              <View>
                <LVList 
                  listItems={item.orders} 
                  pagingEnabled={true} 
                  horizontal={true} 
                  scrollEnabled={true} 
                  options={{...options, flatlist:{marginBottom: 0}}} /> 
                <LVListItem 
                  title={'Checkout'} 
                  onPress={() => {
                    // On item selection
                    // Segue to order details page
                    // console.log('***| CHECKOUT DISH: ', JSON.stringify(dish));
                    this.props.navigate('PCOrderDetails', { 
                      user: this.props.user,
                      orders: orders, 
                      screenProps: this.props.screenProps, 
                      saveToState: this.props.saveToState,
                    });
                  }} 
                  separator={false} 
                  hasSegue={false} 
                  options={{...options, 
                    container:{...styles.checkoutButton, marginBottom: 185}, 
                    title: {...styles.checkoutText, alignSelf:'center'} 
                  }} 
                  user={user} />
              </View>
              
            )}
          }

          //Set cart orders to this.state
          this.props.saveToState('cart', listItems);
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

    const { role } = this.props;
    let { options } = this.props;
    options = (options ? options : {});

    let view = (
      <FlatList 
        key={this.state.refreshState} 
        ref={scrollView => { this._flatList = scrollView; }} 
        style={styles.flatlist} 
        data={this.state.listItems} 
        renderItem={({item}) => {

          return (
            item.component({})
          );
        }} 
        showsVerticalScrollIndicator={false} 
        keyExtractor={(item, index) => index.toString()} />
    );
    if (this.state.listItems.length == 0) {
      view = (
        <View style={styles.emptyOrdersViewContainer}>
          <Image style={styles.emptyOrdersIcon} source={require(assetDir + '/images/empty-cart-icon/empty-cart-icon.png')} />
          <Text style={styles.emptyOrdersText}>Cart Is Empty</Text>
        </View>
      );  
    }

    return (
      <View style={[styles.container, options.container]}>
        { view }
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FEFEFE',
  },

  flatlist: {
    paddingTop: 83,
  },

  cartOrderContainer: {
    flex: 1,
    width: Dimensions.get('window').width - 22,
    marginLeft: 9,
    marginRight: 9,
    marginBottom: 0,

    borderTopWidth: 2,
    borderTopColor: '#F1F1F2',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,

    borderLeftWidth: 2,
    borderLeftColor: '#F1F1F2',

    borderRightWidth: 2,
    borderRightColor: '#F1F1F2',
  },

  checkoutButton: {
    flex: 1,
    backgroundColor: '#8AB560',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginLeft: 10,
    marginRight: 13,
    marginBottom: 15,

    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
    
    borderRightWidth: 2,
    borderRightColor: 'transparent',
    
    borderBottomWidth: 2,
    borderBottomColor: '#8A8A7F',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  checkoutText: {
      color: '#FFFFFF',
      fontSize: 16,
  },

  emptyOrdersViewContainer: {

    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyOrdersText: {
    opacity: 0.85,
  },

  emptyOrdersIcon: {

    height: 100,
    width: 60,
    resizeMode: 'contain',
    opacity: 0.47,
  }, 

});

