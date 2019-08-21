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

import LVOrderItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVOrderItem';
import LVListItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListItem';
import LVInputItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVInputItem';
import LVList from '../../../../src/components/Views/Structure/Lists/SCLVList';

import Global from '../../../../src/global.js'
import Validator from '../../../../src/util/validator.js';
import Debug from '../../../../src/util/debug.js';
import Ajax from '../../../../src/util/ajax.js';

import User from '../../../../src/modals/user/user.js';
import Dish from '../../../../src/modals/menu/dish/dish.js';
import Drink from '../../../../src/modals/menu/drink/drink.js';
import Order from '../../../../src/modals/order/order.js';

import LinearGradient from 'react-native-linear-gradient';

export default class DishDetails extends React.Component {

    static navigationOptions(props) {

        const { dish } = props.navigation.state.params;

        return {
            header: (
                <View style={[gstyles.TBHeader, { 
                    backgroundColor: '#FFFFFF', 
                    borderBottomWidth: 0, 
                    paddingLeft: 0,
                    paddingRight: 0, 
                    flexDirection: 'column', 
                    height: 300, 
                }]}>
                    <Image style={styles.dishImage} source={{ uri:dish.itm_image_path }} />
                    <TouchableOpacity style={styles.backButtonWrapper} onPress={() => {
                        props.navigation.goBack();
                    }} >
                        <Image style={styles.arrowLeftIcon} source={require(assetDir + '/images/white-arrow-left/white-arrow-left.png')} />
                    </TouchableOpacity>
                    <View style={styles.dishDetailsContainer}>
                        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} >
                            <View style={{ padding: 15, paddingTop: 55, }}>
                                <Text style={styles.dishName}>{dish.itm_name}</Text>
                                <Text style={styles.dishPrice}>Price: {Dish.getDishPrice(dish.itm_price)}</Text>
                                <Text style={styles.dishPoints}>Points: {Dish.getDishPoints(dish.itm_price, false)}</Text>
                            </View>
                        </LinearGradient>
                        <Image style={styles.dishUserProfileImage} source={dish.user.profile} />
                    </View>
                </View>
            )
        };
    };


  //Funcs
  resetState = () => {

    this.setState((prevState) => {
      return {
        refreshState: prevState.refreshState + 1,
      };
    });
  }

  addOrdertoCart = () => {

    // Change order role to cart
    var { order, index } = this.state;
    order.role = 'cart';

    // Send cart order to server
    const body = {
        add_cart_item: '',
        menu_item_id: order.menu.dish.itm_id,
        customer_id: order.user.id,
        quantity: order.quantity,
    };

    Ajax.fetchRequest({
        method: 'POST',
        body: body,
        endpoint: '',
    }).then((response) => {
  
        if (Ajax.checkResponse(response)) {

            // Update cart orders
            const { user, screenProps, saveToState } = this.props.navigation.state.params;
            const { cart_items } = response.return_data;

            Order.setOrder(cart_items, 'cart', user).then((orders) => {

                if (orders != null)
                {
                    if (response.status && response.status == 'success' && response.message && response.message.length > 0) {
                        screenProps.onSuccess(response.message, { container:{ backgroundColor: '#8AB560' }});
                        saveToState('cart', orders, true);
                    }
                }
                else {
                    screenProps.onError('There was a problem adding this dish item to your cart, please try again.');
                }
            });
        }
        else
        {
            // Error with response
            const { screenProps } = this.props.navigation.state.params;
            screenProps.onError('There was a problem adding this dish item to your cart, please try again.');
        }
    });
  }

  adjustOrderQuantityAdd = () => {

    var order = this.state.order;
    order.quantity = order.quantity + 1;
    this.setState((prevState) => {

        return {
            refreshState: prevState.refreshState + 1,
            order: order,
        }
    });
  }

  adjustOrderQuantitySubtract = () => {
    var order = this.state.order;
    if (order.quantity > 1) {
        order.quantity = order.quantity - 1;
        this.setState((prevState) => {

            return {
                refreshState: prevState.refreshState + 1,
                order: order,
            }
        });
    }
  }


  //
  constructor(props) {
    super(props);

    const { user, dish } = props.navigation.state.params;
    var { order, index } = props.navigation.state.params;

    if (order == undefined || order == null) {
        index = 0;
        order = Order.getEmptyOrderObject();
        order.user = user;
        order.menu.dish = dish;
    }
    
    const listItems = [
        {
            component: (options) => { return (
                <LVListItem 
                  title={'Description'} 
                  separator={true} 
                  hasSegue={false} 
                  opacity={1.0}
                  options={{
                      ...options, 
                      title: { 
                          color: styles.dishName.color,
                          fontSize: 14,
                      },
                      container: {
                          ...options.container,
                          paddingTop: 15,
                          paddingBottom: 8,
                      }
                  }} 
                  user={user} />
            )}
        },
        {
          component: (options) => { return (
              <LVListItem 
                title={dish.itm_desc} 
                separator={false} 
                hasSegue={false} 
                opacity={1.0}
                options={{
                    ...options, 
                    title: { 
                        color: '#000000', 
                        fontSize: 12, 
                    },
                    container: {
                        ...options.container,
                        paddingTop: 9,
                        paddingBottom: 15,
                    }
                }} 
                user={user} />
            )}
        },
        {
            component: (options) => { return (
                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityInputText}>Quantity: </Text>
                    <View style={styles.quantityInputContainer}>
                        <TouchableOpacity style={styles.quantityInputSubtractContainer} onPress={() => {
                            this.adjustOrderQuantitySubtract();
                        }} >
                            <Text style={{fontSize: 20}}>-</Text> 
                        </TouchableOpacity>
                        <LVInputItem 
                            title={''} 
                            value={order.quantity.toString()} 
                            placeholder={'1'} 
                            placeholderTextColor={'#9A9A9A'} 
                            textAlign={'center'}
                            validator={Validator.quantityString}
                            onChangeText={(value) => { 

                                var { order, index } = this.state;
                                order.quantity = parseInt(value); 
                                this.setState({ order: order }); 
                            }} 
                            secure={false} 
                            keyboardType='number-pad' 
                            separator={false} 
                            hasSegue={false} 
                            options={{...options, container: { ...options.container, flex: 1, alignItems: 'center', }}} 
                            user={user} /> 
                        <TouchableOpacity style={styles.quantityInputAddContainer} onPress={() => {
                            this.adjustOrderQuantityAdd();
                        }} >
                            <Text style={{fontSize: 20}}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        },
        {
            component: (options) => { return (
                <LVListItem 
                    title={'ADD TO CART'} 
                    onPress={this.addOrdertoCart} 
                    separator={false} 
                    hasSegue={false} 
                    options={{...options, 
                        container: [ options.container, { borderRadius:3, marginBottom:10, backgroundColor:'#009344', padding: 15, }], 
                        title: { alignSelf:'center', color:'#FFFFFF'} 
                    }} 
                    user={user} />
            )}
        }
    ];

    this.state = {
      listItems: listItems,
      refreshState: 0,
      index: index,
      order: order,
    };

    this.resetState.bind(this);
    this.addOrdertoCart.bind(this);
    this.adjustOrderQuantityAdd.bind(this);
    this.adjustOrderQuantitySubtract.bind(this);
  }

  render() {

    var { options } = this.props;
    options = (options ? options : {});

    return (
      <View style={[styles.container, options.container]}>
        <StatusBar barStyle="dark-content" />
        <FlatList 
            key={this.state.refreshState} 
            ref={scrollView => { this._flatList = scrollView; }} 
            style={styles.flatlist} 
            data={this.state.listItems} 
            renderItem={({item}) => {

                return (
                    item.component({
                        container: { 
                            padding: 0, 
                        }
                    })
                );
                }} 
            showsVerticalScrollIndicator={false} 
            keyExtractor={(item, index) => index.toString()} />
      </View>
    );
  }
}

const gstyles = StyleSheet.create(Global.NavigationHeader(false));
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
    paddingLeft: 15,
    paddingRight: 15,
  },

  dishUserProfileImage: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 25,
    bottom: -25,
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#C0C0C0',
  },

  dishImage: {
    flex: 1,
    position: 'absolute',
    height: 300,
    width: Dimensions.get('window').width,
    resizeMode: 'cover',
  },

  dishDetailsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backButtonWrapper: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 6,
    marginLeft: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  backButtonText: {
    color: '#FFFFFF'
  },

  arrowLeftIcon: {
    width: 15,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
  },

  dishName: {
    color: '#F16522',
    fontSize: 24,
    marginBottom: 4,
  },

  dishPoints: {
    color: '#FFFFFF',
    fontSize: 16,
  },

  dishPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 1,
},

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFDAE0',
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 15,
    marginBottom: 15,  
  },

  quantityInputText: {
    flex: 1,
  },   

  quantityInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityInputAddContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityInputSubtractContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
  
});
