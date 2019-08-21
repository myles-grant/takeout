import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  FlatList,
 } from 'react-native';


const assetDir = '../../../assets';

import TBFLMain from '../../../src/components/Views/Structure/TabBar/SCTBFLMain';
import TBItem from '../../../src/components/Views/Structure/TabBar/SCTBItem';

import UserProfile from '../../../src/components/Views/Pages/PCSignup';
import HomeFeed from '../../../src/components/Views/Pages/PCHomeFeed';
import Order from '../../../src/components/Views/Pages/PCOrder';
import Cart from '../../../src/components/Views/Pages/PCCart';
import Dish from '../../../src/components/Views/Pages/PCDish';
import Menu from '../../../src/components/Views/Pages/PCDish';
import Drink from '../../../src/components/Views/Pages/PCDrink';


const offset = 111;

export default class TBController extends React.Component {

  // Funcs
  onTabBarItemPressed = (prevIndex, index) => {

    //Set selected tab
    let items = this.state.renderItems;
    for(i=0; i<items.length; i++)
    {
      items[i] = {
        ...items[i],
        selected: (index == i),
      };
    }

    // Refresh TBFLMain state to refresh selected View
    // Scroll to target view
    let viewWidth = Dimensions.get('window').width;
    let targetX = viewWidth * index;

    this._flatList.scrollToOffset({
      offset: targetX,
      animated: true,
    });

    this.setState({
      renderItems: items,
    });
  }

  // NavigationController Delegate Funcs
  navigate = (destination, props = {}) => {
    this.props.navigation.navigate(destination, props);
  }

  saveToState = (page, items, updateRender = false) => {

    let renderItems = this.state.renderItems;
    for(i=0; i<renderItems.length; i++)
    {
      // renderItems[i] = {
      //   ...renderItems[i],
      //   notificationCount: (page == renderItems[i].title && page != 'home' ? items.length : null),
      // };
      if (page == renderItems[i].title && page != 'home') {
        renderItems[i].notificationCount = items.length;
      }
    }
    
    if (page == 'home') {
      this.setState({
        dishes: items,
        renderItems: renderItems,
      });
    } else if(page == 'cart') {
      this.setState((prevState) => {
        return {
          TBFLRefreshState: prevState.TBFLRefreshState + (updateRender ? 1 : 0),
          //cartOrders: items,
          renderItems: renderItems,
        }
      });
    } else if(page == 'order') {
      this.setState((prevState) => {
        return {
          TBFLRefreshState: prevState.TBFLRefreshState + (updateRender ? 1 : 0),
          //orders: items,
          renderItems: renderItems,
        }
      });
    }
  }


  //
  constructor(props) {
    super(props);

    this.state = {
      TBFLRefreshState: 1,
      renderItems: [],
      dishes: [],
      cartOrders: [],
      orders: [],
      stateCache: {

        // Tabbar navigation cache
        initialView: 0,
        targetView: 0,
      },
    };

    //Get user
    const user = props.screenProps.user;
    if(user == null) {
      //User is required.. log user out
      props.screenProps.logout();
    } 

    this.onTabBarItemPressed.bind(this);
    this.saveToState.bind(this);
    this.navigate.bind(this);
  }

  componentWillMount() {
    
    const user = this.props.screenProps.user;
    if(user == null) {
      //User is required.. log user out
      this.props.screenProps.logout();
      return;
    }

    let renderItems = [];
    if(user.role == 'chef')
    {
      renderItems = [
        {
          title: 'Profile',
          selected: true,
          imageIconSrc: require(assetDir + '/images/home-icon/home-icon.png'),
          component: (options) => { 
            return (
              <UserProfile 
                screenProps={this.props.screenProps} 
                user={user} 
                options={{...options}} />
            )
          },
        },
        {
          title: 'Orders',
          selected: false,
          imageIconSrc: require(assetDir + '/images/orders-icon/orders-icon.png'),
          component: (options) => { 
            return (
              <Order 
                screenProps={this.props.screenProps} 
                saveToState={this.saveToState} 
                navigate={this.navigate} 
                user={user} 
                role={'order'}
                orders={this.state.orders} 
                options={{...options}} />
            )
          },
        },
        {
          title: 'Dish',
          selected: false,
          imageIconSrc: require(assetDir + '/images/dish-icon/dish-icon.png'),
          component: (options) => { 
            return (
              <Dish 
                user={user} 
                dish={null}
                options={{...options}} />
            )
          },
        },
        {
          title: 'Drink',
          selected: false,
          imageIconSrc: require(assetDir + '/images/drink-icon/drink-icon.png'),
          component: (options) => { 
            return (
              <Drink 
                user={user} 
                options={{...options}} />
            )
          },
        },
        {
          title: 'Menu',
          selected: false,
          imageIconSrc: require(assetDir + '/images/menu-icon/menu-icon.png'),
          component: (options) => { 
            return (
              <Menu 
                saveToState={this.saveToState} 
                user={user} 
                dish={null}
                dishes={this.state.dishes}
                options={{...options}} />
            )
          },
        },
      ];
    }
    else if(user.role == 'customer')
    {
      renderItems = [
        {
          title: 'home',
          selected: true,
          imageIconSrc: require(assetDir + '/images/home-icon/home-icon.png'),
          component: (options) => { 
            return (
              <HomeFeed 
                saveToState={this.saveToState}
                user={user}
                dishes={this.state.dishes} 
                navigate={this.navigate}
                screenProps={this.props.screenProps} 
                options={{...options}} />
            )
          },
        },
        {
          title: 'cart',
          selected: false,
          imageIconSrc: require(assetDir + '/images/cart-icon/cart-icon.png'),
          notificationCount: this.state.cartOrders.length,
          component: (options) => { 
            return (
              <Cart
                test={this.state.TBFLRefreshState}
                saveToState={this.saveToState}
                user={user}
                role={'cart'}
                navigate={this.navigate}
                orders={this.state.cartOrders}
                options={{...options}} 
              />
            )
          },
        },
        {
          title: 'orders',
          selected: false,
          imageIconSrc: require(assetDir + '/images/orders-icon/orders-icon.png'),
          notificationCount: this.state.orders.length,
          component: (options) => { 
            return (
              <Order 
                saveToState={this.saveToState} 
                user={user} 
                role={'order'}
                orders={this.state.orders} 
                options={{...options}} />
            )
          },
        },
        {
          title: 'profile',
          selected: false,
          imageIconSrc: require(assetDir + '/images/cog-icon/cog-icon.png'),
          component: (options) => { 
            return (
              <UserProfile 
                user={user} 
                screenProps={this.props.screenProps} 
                options={{...options, container:{...options.container, marginTop: 75}}} />
            )
          },
        },
      ];
    }

    this.setState((prevState) => {
      return {
        renderItems: renderItems,
      }
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.TBContainer}>
          <FlatList 
            key={this.state.TBFLRefreshState}
            ref={scrollView => { this._flatList = scrollView; }} 
            style={styles.offset} 
            data={this.state.renderItems} 
            //extraData={this.state.TBFLRefreshState} 
            renderItem={({item}) => {

              console.log('***| TB MAIN FL ', item.title);
              return (
                item.component({
                  container: {
                    width: Dimensions.get('window').width,
                  }
                })
              );
            }} 
            pagingEnabled={true} 
            horizontal={true} 
            scrollEnabled={false} 
            keyExtractor={(item, index) => index.toString()} />
        </View>
        <View style={styles.TBTabsContainer}>
          {
            this.state.renderItems.map((item, index, array) => {

              return (
                // Note: May passing the item component as a prop to be rendered by the tabbar tab... behaviour sorta like a television changing stations
                <TBItem 
                  key={item.title}
                  selected={item.selected} 
                  imageIconSrc={item.imageIconSrc} 
                  notificationCount={item.notificationCount}
                  onPress={{ 
                    prevSelected: this.state.stateCache.initialView, 
                    selected: index, 
                    func: this.onTabBarItemPressed 
                  }} 
                />
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
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
  },

  TBTabsContainer: {
    margin: 15,
    marginLeft: 8,
    marginRight: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#F6F7F9',
    borderTopColor: '#EDECED',
    backgroundColor: 'rgba(255,255,255, 0.9)', //'rgba(246,247,249, 0.95)',
  },

  TBContainer: {
    top: offset, //push view down to achieve tabbar overlay effect
    height: Dimensions.get("window").height, //Use screen height to get fullscreen since not only child component in parent tabbarcontroller
  },

  offset: {
    flex: 1,
  },

  options: {
    flex: 1,
    backgroundColor: 'red',
  },


});
