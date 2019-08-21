import { AsyncStorage } from 'react-native';
import Ajax from '../../../src/util/ajax.js';
import Global from '../../../src/global.js';
import Dish from '../../../src/modals/menu/dish/dish.js';
import Drink from '../../../src/modals/menu/drink/drink.js';

const asyncStorageModalId_order = '@TakeoutModal:order';
const asyncStorageModalId_cart = '@TakeoutModal:cart';

const parseOrderJSON = (order, role, owner) => {
  let orders = [];
  if (role == 'cart') {
    for (let key in order)
    {
        const item = order[key];

        // Add dish owner (user) //.. this is temp done on client till api returns user in response object
        const user = {
            id: item.chef_id,
            rating: item.rating,
            role: 'chef',
            name: item.name,
            email: item.email,
            phoneNumber: item.phone_number,
            token: item.token,
            profile: { uri: item.profile_picture_base_64 },
            location: {
                home: {
                    name: item.home_address,
                    lat: item.home_address_lat,
                    lon: item.home_address_lng,
                },
                work: {
                    name: null,
                    lat: 0.00,
                    lon: 0.00,
                },
            }
        };

        // Dish loop
        let items = [];
        for(let index in item.cart_items)
        {
            let itemObj = item.cart_items[index];
            //itemObj.itm_image_path = 'https://pinecone.info/assets/images/logo.png';
            
            const newItem = {
                ...itemObj,
                user: user,
            }

            //
            items.push({
              id: itemObj.cart_id,
              role: 'cart',
              user: owner,
              quantity: itemObj.cart_itm_qty,
              notes: '',
              tip: 0.00,
              menu: { 
                dish: newItem, 
                drink: item.drinks,
              },
            });  
        }
      orders.push(items);
    }

    return orders;
  }
  else if (role == 'order') {

    // 
    let items = [];
    for(let key in order) {

      const item = order[key];

      const user = {
        id: item.chef_id,
        rating: item.rating,
        role: 'chef',
        name: item.name,
        email: item.email,
        phoneNumber: item.phone_number,
        token: item.token,
        profile: { uri: item.profile_picture_base_64 },
        location: {
          home: {
              name: item.home_address,
              lat: item.home_address_lat,
              lon: item.home_address_lng,
          },
          work: {
              name: null,
              lat: 0.00,
              lon: 0.00,
          },
        }
      };


      // loop through to get quantity
      let qtyObj = {};
      let dishes = {};
      let status = 'pending';
      for (let index in item.orders)
      {
        const itemObj = item.orders[index];
        //itemObj.itm_image_path = 'https://pinecone.info/assets/images/logo.png';

        const _key = itemObj.dish_id;
        qtyObj[_key] = itemObj.cart_itm_qty; 

        const newItem = {
          ...itemObj,
          user: user,
        }

        dishes[_key] = newItem;
        status = itemObj.order_state;
      }
      
      items.push({
        id: key,
        role: 'order',
        user: owner,
        quantity: qtyObj,
        notes: item.notes,
        tip: item.tip,
        status: status,
        menu: { 
          dish: dishes, 
          drink: item.drinks,
        },
      });  
    }

    console.log('***| ORDER ORDER ITEMS: ', JSON.stringify(items));
    return items;
  }

  return null;
};

export default {

  async getOrder(user, _order, role) {
    console.log('Fetching Orders...');
    if (_order != undefined && _order != null && _order.length > 0) {
      console.log('Orders of type retrieved: Item stored in state.');
      return { loaded: null, state: _order };
    }

    // Check store
    try {
      let data = [];
      if (role == 'order') {
        data = await AsyncStorage.getItem(asyncStorageModalId_order);
      } else if (role == 'cart') {
        data = await AsyncStorage.getItem(asyncStorageModalId_cart);
      }

      data = JSON.parse(data);
      if (data != undefined && data != null && data.length > 0) {
        console.log('Orders of type retrieved: Item stored in asyncStore: ');
        console.log('AT ROLE: ', role);
        return { loaded: data, state: null };
      }


      // Failed to retrieve order data..
      // Check API
      const response = await Ajax.fetchRequest({
        method: 'POST',
        body: {
          user_id: user.id,
          get_user_data: user.role,
        },
        endpoint: '',
      });

      if (Ajax.checkResponse(response)) {

        // Temp.. Re-create order object.. this is temp done on client till api returns user in response object
        const order = parseOrderJSON(response.return_data.cart_items, role, user);
        // Temp end

        if (role == 'order') {
          AsyncStorage.setItem(asyncStorageModalId_order, JSON.stringify(order));
        } else if (role === 'cart') {
          AsyncStorage.setItem(asyncStorageModalId_cart, JSON.stringify(order));
        }
        console.log('Orders retrieved: Item fetched from api: ', JSON.stringify(order));
        console.log('AT ROLE: ', role);
        return { loaded: order, state: null };
      }

      // Failed to get response
      // ..
      return { loaded: _order, state: null };
    } catch (error) {
      console.log('Failed to fetch Order: ', error);
      return { loaded: null, state: null };
    }
  },

  getEmptyOrderObject(role = 'order') {
    return {
      id: Global.emptyOrder(),
      role: 'order',
      user: null,
      quantity: 1,
      notes: '',
      tip: 0.00,
      status: 'pending',
      menu: {
        dish: Dish.getEmptyDishObject(),
        drink: Drink.getEmptyDrinkObject(),
      },
    }
  },

  getPriceTotalFromOrder(orders, string = true) {

    // Loop / parse order object to get the prices total
    let priceTotal = 0.00;
    for (let key in orders) {
      const order = orders[key].order;
      const dish = order.menu.dish;

      const qty = order.quantity;
      const price = Dish.getDishPrice(dish.itm_price, false);

      priceTotal += price * qty;
    }

    if (string) {
      priceTotal = '$' + priceTotal.toFixed(2);
    } else {
      priceTotal = priceTotal.toFixed(2);
    }

    return priceTotal;
  },

  getTaxTotalFromOrder(orders, string = true) {

    // Loop / parse order object to get the prices total
    const priceTotal = parseFloat(this.getPriceTotalFromOrder(orders, false));
    let taxPercentage = 0.00;
    if (string) {
      taxPercentage = '$' + (priceTotal.toFixed(2) * Global.HST_TAX_PERCENTAGE()).toFixed(2);
    } else {
      taxPercentage = (priceTotal.toFixed(2) * Global.HST_TAX_PERCENTAGE()).toFixed(2);
    }

    return taxPercentage;
  },

  getGrandTotalFromOrder(orders, string = true) {

    const priceTotal = parseFloat(this.getPriceTotalFromOrder(orders, false));
    const taxPercentage = parseFloat(this.getTaxTotalFromOrder(orders, false));

    // Get tip value
    const tip = 0.00;

    let grandTotal = priceTotal + tip + taxPercentage;
    if (string) {
      grandTotal = '$' + grandTotal.toFixed(2);
    } else {
      taxPercentage = grandTotal.toFixed(2);
    } 

    return grandTotal;
  },
 
  async setOrder(order, role, user) {
    console.log('Saving Orders...');
    try {
      // Temp.. Re-create order object.. this is temp done on client till api returns user in response object
      let orders = parseOrderJSON(order, role, user);
      // Temp end

      if (role == 'cart') {
        response = await AsyncStorage.setItem(asyncStorageModalId_cart, JSON.stringify(orders));
      } else if (role == 'order') {
        response = await AsyncStorage.setItem(asyncStorageModalId_order, JSON.stringify(orders));
      }

      if (orders != undefined && orders != null && order.length == 0) {
        orders = null;
      }
      
      return orders;
    } catch (error) {
      console.log('Error saving order: ', error);
      return null;
    }
  },

  addOrder(order, storageId, role) {
    console.log('Adding Orders...');
    try {
      if (role == 'order') {
        AsyncStorage.setItem(asyncStorageModalId_order.concat(storageId), JSON.stringify(order));
      } else if (role == 'cart') {
        AsyncStorage.setItem(asyncStorageModalId_cart.concat(storageId), JSON.stringify(order));
      }
      return order;
    } catch (error) {
      console.log('Error adding order: ', error);
      return null;
    }
  }
};
