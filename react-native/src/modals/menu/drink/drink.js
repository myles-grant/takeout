import { AsyncStorage } from 'react-native';
import Ajax from '../../../../src/util/ajax.js';
import Global from '../../../../src/global.js';

const asyncStorageModalId_drink = '@TakeoutModal:drink';


export default {

  async getDrink(user, _drink) {
    if (_drink != null && _drink.length > 0) {
      //console.log("Drinks: Item stored in state ");
      return { loaded: null, state: _drink };
    }

    // Check store
    try {
      let data = await AsyncStorage.getItem(asyncStorageModalId_drink);
      data = JSON.parse(data);
      if (data != undefined && data != null && data !== null) {
        //console.log("Drinks: Item stored in asyncStore ");
        return { loaded: data, state: null };
      }
      
      // Failed to retrieve orders data..
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
        const drink = response.return_data.drink;
        const store = await AsyncStorage.setItem(asyncStorageModalId_drink, JSON.stringify(drink));

        //console.log("Drinks: Item fetched from api ");
        return { loaded: drink, state: null };
      }
      
      // Failed to get response
      // ..
      return { loaded: _drink, state: null };
    } catch (error) {
      //console.log('Failed to fetch drink: ', error);
      return null;
    }
  },

  getEmptyDrinkObject() {
    return {
      sprite: {
        qty: 0,
        price: 0.00,
      },
      icetea: {
        qty: 0,
        price: 0.00,
      },
      coke: {
        qty: 0,
        price: 0.00,
      },
      fanta: {
        qty: 0,
        price: 0.00,
      },
    }
  },

  setDrink(drink) {
    //console.log('Saving Drinks: ', drink);
    try 
    {
      AsyncStorage.setItem(asyncStorageModalId_drink, JSON.stringify(drink));
      return drink;
    }
    catch (error) 
    {
      //console.log('Error saving orders:', error);
      return null;
    }
  },



















};
