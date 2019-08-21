
import React from 'react';
import {
  AsyncStorage,
  View,
  Image,
  StyleSheet,
  Button,
} from 'react-native';
import Firebase from 'react-native-firebase';

const assetDir = '../../../assets';

import User from '../../../src/modals/user/user.js';
import Dish from '../../../src/modals/menu/dish/dish.js';
import Drink from '../../../src/modals/menu/drink/drink.js';
import Order from '../../../src/modals/order/order.js';

import Splash from '../../../src/components/Views/Pages/PCSplash';
import Navigation from './NavigationController';
import Global from '../../../src/global.js';


const asyncStorageModalId_user = '@TakeoutModal:user';
const asyncStorageModalId_order = '@TakeoutModal:order';
const asyncStorageModalId_dish = '@TakeoutModal:dish';
const asyncStorageModalId_drink = '@TakeoutModal:drink';


export default class Main extends React.Component {

  login = (user) => {

    User.setUser(user);
    this.setState((prevState) => {
      return {
        refreshState: prevState.refreshState + 1,
        onLoad: <Navigation key={(prevState.refreshState + 1)} logout={this.logout} user={user} onLoad="TBCNav" />,
      };
    });
  }

  logout = () =>
  {
    User.setUser(null);
    Dish.setDish(null);
    Drink.setDrink(null);
    Order.setOrder(null);
    
    this.setState((prevState) => {
      return {
        refreshState: prevState.refreshState + 1,
        onLoad: <Navigation key={(prevState.refreshState + 1)} login={this.login} user={null} onLoad="LVNav" />,
      };
    });
  }

  //
  constructor(props) {
    super(props);

    this.state = {
      refreshState: 0,
      onLoad: <Splash />,
    };

    this.login.bind(this);
    this.logout.bind(this);
  }

  //Lifecycle Component Methods
  componentDidMount() {

    //Check if there is any user logged in
    User.getUser(null).then((user) => {

      if(user == null) {

        //Failed to retrieve user data.. set view to main
        this.setState({
          onLoad: <Navigation key={this.state.refreshState} login={this.login} user={user} onLoad="LVNav" />,
        });
      }
      else
      {
        //User found
        // Authenticate firebase
        Firebase.auth().signInWithEmailAndPassword(Global.FBUsername(), Global.FBPassword()).then((FBUser) => {

          if (FBUser) {
            // Set initial view
            this.setState({
              onLoad: <Navigation key={this.state.refreshState} logout={this.logout} user={user} onLoad="TBCNav" />,
            });
          }
          else 
          {
            // Failed to authenticate firebase user.. go to login page
            this.setState({
              onLoad: <Navigation key={this.state.refreshState} login={this.login} user={user} onLoad="LVNav" />,
            });
          }

          return FBUser;
        });

        
      }

      return null;
    });
  }


  render() {
    return this.state.onLoad;
  }
}
