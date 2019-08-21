import { AsyncStorage } from 'react-native';
import Ajax from '../../../../src/util/ajax.js';
import Global from '../../../../src/global.js';
import User from '../../../../src/modals/user/user.js';

const asyncStorageModalId_dish = '@TakeoutModal:dish';

const parseDishJSON = (dish) => {

  // Temp.. Add dish owner (user) //.. this is temp done on client till api returns user in response object
  let dishes = [];
  for(let key in dish)
  {
    const item = dish[key];
    const user = {
      id: item.chef_id,
      rating: item.rating,
      role: 'chef',
      name: item.name,
      email: item.email,
      phoneNumber: item.phone_number,
      profile: { uri: item.profile_picture_base_64 },
      location: {
        home: {
          name: item.home_address,
          lat: item.lat,
          lon: item.lng,
        },
        work: {
          name: null,
          lat: 0.00,
          lon: 0.00,
        },
      }
    };
  
    //
    let items = [];
    for(let index in item.menu_items)
    {
      let itemObj = item.menu_items[index];
      //itemObj.itm_image_path = 'https://pinecone.info/assets/images/logo.png';
  
      const newItem = {
        ...itemObj,
        user: user,
      };
  
      items.push(newItem);
    }

    dishes.push(items);
  }
  

  return dishes;
};
// Temp end

export default {

  //
  async getDish(user, _dish) {

    if (_dish != undefined && _dish != null && _dish.length > 0) {
      //console.log('Dishes retrieved: Item stored in state');
      return { loaded: null, state: _dish };
    }

    // Check store
    try
    {
      let data = await AsyncStorage.getItem(asyncStorageModalId_dish);
      data = JSON.parse(data);
      if (data !== undefined && data !== null && data.length > 0) {
        //console.log('Dishes retrieved: Item stored in asyncStore');
        return { loaded: data, state: null };
      }

      // Failed to retrieve dish data..
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
        const dish = parseDishJSON(response.return_data.menu_items);

        // Save both unfiltered response and filtered response.. unfiltered response is used for quick queries compare
        // response with unfiltered response to see if any changes were made.. if changes found filter and save new
        // filtered response.. updated state

        // Before saving dish reorder list from nearest to furthest
        // ..

        AsyncStorage.setItem(asyncStorageModalId_dish, JSON.stringify(dish));

        //console.log('Dishes retrieved: Item fetched from api ');
        return { loaded: dish, state: null };
      }
      
      // Failed to get response
      // ..
      return { loaded: _dish, state: null };

    } catch (error) {
      //console.log('Failed to fetch dish: ', error);
    }
  },

  setDish(dish, role)
  {
    //console.log('Saving Dish');
    try 
    {
      const dishes = parseDishJSON(dish);
      AsyncStorage.setItem(asyncStorageModalId_dish, JSON.stringify(dishes));
      return dishes;
    }
    catch (error) 
    {
      //console.log('Error saving dish: ', error);
      return null;
    }
  },

  getDishPrice(price, string = true)
  {
    // Price is in dollars
    let _price = 0.00;
    if (string) {
      _price = "$" + parseFloat(price).toFixed(2);
    } else {
      _price = parseFloat(price).toFixed(2);
    }
    return _price;
  },


  getDishPoints(price, adjust = true)
  {
    // Price is in dollars
    const _price = parseFloat(price).toFixed(2);
    return (_price * 20.00) + (adjust ? ' points' : '');
  },

  getEmptyDishObject() {
    return {

      id: Global.emptyDish(),
      role: 'dish',
      name: '',
      description: '',
      start_time: 'Dish Start Time',
      end_time: 'Dish End Time',
      price: 0.00,
      quantity: 0,
      inventory: 0,
      order_prep_time: 0, // minutes
      tags: '',
      photo: require('../../../../assets/images/no-image-available-icon/no-image-available-icon.png'),
      photoUri: '',
      user: User.getEmptyUserObject(),
    };
  },




};
