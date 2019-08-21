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
  Platform,
 } from 'react-native';


const assetDir = '../../../../assets';

import LVOrderItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVOrderItem';
import LVListItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListItem';
import LVListImageItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListImageItem';
import LVInputItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVInputItem';
import LVList from '../../../../src/components/Views/Structure/Lists/SCLVList';

import Validator from '../../../../src/util/validator.js';
import Global from '../../../../src/global.js'
import Debug from '../../../../src/util/debug.js';
import User from '../../../../src/modals/user/user.js';
import Dish from '../../../../src/modals/menu/dish/dish.js';
import Order from '../../../../src/modals/order/order.js';


export default class OrderDetails extends React.Component {

    static navigationOptions(props) {

      let { user } = props;
      if (user == undefined || user == null) {
        user = props.navigation.state.params.user;
      }

      if (user.role == 'customer')
      {
        return {
          header: (
            <View style={[gstyles.TBHeader, { height: (Platform.OS == 'ios' ? 75 : 50), backgroundColor:'#F48666'}]}>
              <View style={gstyles.TBHeaderLeft}>
                <TouchableOpacity style={styles.backButtonWrapper} onPress={() => {
                        props.navigation.goBack();
                    }} >
                      <Image style={styles.arrowLeftIcon} source={require(assetDir + '/images/white-arrow-left/white-arrow-left.png')} />
                      <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
              <View style={gstyles.TBHeaderCenter}>
                <Image style={[gstyles.TBHeaderImage, {width:110}]} source={require(assetDir + '/images/logo-white-full/logo-white-full.png')} />
              </View>
              <View style={gstyles.TBHeaderRight}>
              </View>
            </View>
          )
        }
      } 
      else if (user.role == 'chef')
      {
        return {
          header: (
              <View style={gstyles.TBHeader}>
                <View style={gstyles.TBHeaderLeft}>
                  <TouchableOpacity style={styles.backButtonWrapper} onPress={() => {
                      props.navigation.goBack();
                  }} >
                      <Image style={styles.arrowLeftIcon} source={require(assetDir + '/images/white-arrow-left/white-arrow-left.png')} />
                      <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
                <View style={gstyles.TBHeaderCenter}>
                  <Image style={gstyles.TBHeaderImage} source={require(assetDir + '/images/logo-white-full-2/logo-white-full-2.png')} />
                </View>
                <View style={gstyles.TBHeaderRight}>
                </View>
              </View>
          )
        };
      }
    };


  //Funcs
  resetState = () => {

    this.setState((prevState) => {
      return {
        refreshState: prevState.refreshState + 1,
      };
    });
  }

  removeOrderItemButtonPressed = () => {


  } 

  addDrinksButtonPressed = () => {


  }

  placeOrderButtonPressed = () => {

  }


  //
  constructor(props) {
    super(props);

    const { user }  = props.screenProps.user;
    let { orders } = props;
    if (orders == undefined || orders == null) {
      orders = props.navigation.state.params.orders;
    }

    let order = Order.getEmptyOrderObject();

    // Set order menu dishes
    let dishes = [];
    for (let key in orders) {
      const order = orders[key].order;

      const dish = order.menu.dish;
      dishes.push({
        component: (options) => { return (
          <View style={[styles.orderItemsContainer, options.container, { paddingRight:0, paddingLeft: 0}, (key == orders.length-1 ? { borderBottomWidth: 0.5, borderBottomColor: '#CFDAE0' } : {})]}>
            <LVListImageItem 
              title={dish.itm_name}
              image={{ uri:dish.itm_image_path }}
              separator={false}
              opacity={1.0}
              options={{
                container: {
                  padding: 0,
                },
                title: {
                  marginLeft: 5,
                },
                image: {
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                }
              }}
            />
            <View style={styles.orderItemsPriceDetailsConatainer}>
              <Text style={styles.orderPriceItemDetailText}>{Dish.getDishPrice(dish.itm_price)} (x{order.quantity})</Text>
              <TouchableOpacity style={styles.orderItemRemoveItemButton} onPress={() => {
                this.removeOrderItemButtonPressed();
              }} >
                <Image style={styles.orderItemRemoveItemButtonImage} source={require(assetDir + '/images/white-exit-icon/white-exit-icon.png')} />
              </TouchableOpacity>
            </View>
          </View>
          
        )}
      });
    }


    const dish = orders[0].order.menu.dish;
    const listItems = [
      {
          component: (options) => { return (
              <LVListItem 
                title={dish.user.name} 
                separator={false} 
                hasSegue={false} 
                opacity={1.0}
                options={{...options, 
                  title:{ 
                    fontSize: 20,
                  },
                  container: {
                    ...options.container,
                    paddingBottom: 9,
                  }
                }} 
                user={user} />
          );}
      },
      {
          component: (options) => { return (
              <View style={[options.container, { flex: 1, marginLeft:0, marginRight:0, paddingTop: 0, paddingBottom: 0, flexDirection: 'row', height: 140, }]}>
                <View style={styles.mapViewImage}></View>
                <Image style={styles.userImage} source={{ uri:dish.itm_image_path }} />
              </View>
          );}
      },
      {
          component: (options) => { return (
              <LVListItem 
                title={dish.user.location.home.name} 
                separator={false} 
                hasSegue={false} 
                opacity={1.0}
                options={{...options}}
                user={user} />
          );}
      },
      {
        component: (options) => { 
          return (
            <LVInputItem
              title={''}
              value={order.notes}
              placeholder={'Notes for the chef:'}
              placeholderTextColor={'#9A9A9A'}
              validator={Validator.regString}
              onChangeText={(value) => {
                order.notes = value; 
                this.setState({ order: order }); 
              }} 
              secure={false} 
              keyboardType='default' 
              separator={true} 
              hasSegue={false} 
              options={{...options, 
                container: {
                  ...options.container,
                  borderWidth: 1,
                  borderColor: '#CFDAE0',
                  borderRadius: 3,
                  padding: 0,
                  paddingTop: 0,
                  paddingBottom: 5,
                },
                textInput: {
                  paddingTop: 0,
                }
              }} 
              user={user} /> 
          )}
      },
      {
        component: (options) => { return (
            <LVListItem 
              title={'Items'} 
              separator={false} 
              hasSegue={false} 
              separator={true}
              opacity={1.0}
              options={{...options, 
                title:{ 
                  fontSize: 20,
                },
                container: {
                  ...options.container,
                  paddingBottom: 9,
                }
              }} 
              user={user} />
        );}
      },
      ...dishes,
      {
        component: (options) => { return (
            <LVListItem 
              title={'Add Drinks'} 
              separator={true} 
              hasSegue={true} 
              options={{...options, ...styles.addDrinksButton, title:{...styles.addDrinksButtonText}, segueIcon:{ height:15, tintColor: '#1D9BF6' }}}
              onPress={this.addDrinksButtonPressed}
              user={user} />
        );}
      },
      {
        component: (options) => { return (
            <View style={[styles.orderTotalPriceDetailsContainer, options.container, {paddingRight: 0}]}>
              <LVListItem 
                title={'Total:'} 
                separator={false} 
                hasSegue={false} 
                opacity={1.0}
                options={{ container:{padding: 0}}}
                user={user} />
              <Text style={styles.orderTotalPriceDetailText}>{Order.getPriceTotalFromOrder(orders)}</Text>
            </View>
            
        );}
      },
      {
        component: (options) => { return (
          <View style={[styles.orderTotalPriceDetailsContainer, options.container, {paddingRight: 0}]}>
              <LVListItem 
                title={'Tax (HST - 13%):'} 
                separator={false} 
                hasSegue={false} 
                opacity={1.0}
                options={{ container:{padding: 0}}}
                user={user} />
              <Text style={styles.orderTotalPriceDetailText}>{Order.getTaxTotalFromOrder(orders)}</Text>
          </View>
        );}
      },
      {
        component: (options) => { 
          return (
            <LVInputItem
              title={'Tip for the chef?'}
              value={order.tip}
              placeholder={'0.00'}
              placeholderTextColor={'#9A9A9A'}
              validator={Validator.priceString}
              textAlign={'right'}
              onChangeText={(value) => {
                order.tip = value; 
                this.setState({ order: order }); 
              }} 
              secure={false} 
              keyboardType='number-pad' 
              separator={false} 
              hasSegue={false} 
              options={{...options, 
                container: {
                  ...options.container,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 0,
                  paddingTop: 15,
                  paddingBottom: 15,
                  paddingLeft: 0,
                  paddingRight: 0,
                },
                textInput: {
                  paddingTop: 0,
                  borderWidth: 1,
                  borderColor: '#CFDAE0'
                },
                contentColumnWrapper: {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              }} 
              user={user} /> 
          )}
      },
      {
        component: (options) => { return (
          <View style={[styles.orderTotalPriceDetailsContainer, options.container, {paddingRight: 0}]}>
              <LVListItem 
                title={'Redeem Points:'} 
                separator={false} 
                hasSegue={false} 
                opacity={1.0}
                options={{ container:{padding: 0}}}
                user={user} />
              <Text style={styles.orderTotalPriceDetailText}>$0.00</Text>
          </View>
        );}
      },
      {
        component: (options) => { return (
          <View style={[styles.orderTotalPriceDetailsContainer, options.container, {paddingRight: 0, marginBottom: 10}]}>
            <LVListItem 
              title={'Grand Total:'} 
              separator={false} 
              hasSegue={false} 
              opacity={1.0}
              options={{ container:{padding: 0}}}
              user={user} />
              <Text style={styles.orderTotalPriceDetailText}>{Order.getGrandTotalFromOrder(orders)}</Text>
          </View>
        );}
      },
      {
        component: (options) => { 
          return (
            <LVListItem 
              title={'PLACE ORDER'} 
              onPress={this.placeOrderButtonPressed} 
              separator={true} 
              hasSegue={false} 
              options={{...options, 
                container: {...options.container, borderRadius:3, borderBottomWidth:2, borderBottomColor:'#006738', borderRightColor:'#009344', marginBottom:30, backgroundColor:'#009344'}, 
                title: { alignSelf:'center', color:'#FFFFFF'} 
              }} 
              user={user} />
          )
        }
      },
    ];

    this.state = {
      order: order,
      listItems: listItems,
      refreshState: 0,
    };

    this.resetState.bind(this);
    this.removeOrderItemButtonPressed.bind(this);
    this.addDrinksButtonPressed.bind(this);
    this.placeOrderButtonPressed.bind(this);
  }

  render() {

    let { options } = this.props;
    options = (options ? options : {});

    return (
      <View style={[styles.container, options.container]}>
        <FlatList 
          key={this.state.refreshState} 
          ref={scrollView => { this._flatList = scrollView; }} 
          style={styles.flatlist} 
          data={this.state.listItems} 
          renderItem={({item}) => {

            return (
              item.component({
                container: {
                  marginLeft: 15,
                  marginRight: 15,
                  padding: 0,
                  paddingLeft: 0,
                  paddingRight: 15,
                  paddingTop: 15,
                  paddingBottom: 15,
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
  },

  flatlist: {
    flex: 1,
  },

  backButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#FFFFFF'
  },

  arrowLeftIcon: {
    width: 15,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },

  userImage: {
    flex: 1,
    marginLeft: 2.5,
    resizeMode: 'cover',
  },  

  mapViewImage: {
    flex: 1,
    marginRight: 2.5,
  },

  orderItemsPriceDetailsConatainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },

  orderPriceItemDetailText: {
    marginRight: 5,
  },
  
  orderItemsContainer: {
    flexDirection: 'row',
  },

  orderItemRemoveItemButton: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#F48666',
    justifyContent: 'center',
    alignItems: 'center',
  },

  orderItemRemoveItemButtonImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },

  addDrinksButtonText: {
    color: '#248CFF'
  },  

  orderTotalPriceDetailsContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderTotalPriceDetailText: {

  }
});
