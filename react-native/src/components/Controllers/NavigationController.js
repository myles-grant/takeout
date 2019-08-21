import React from 'react';
import {
  View,
  StatusBar,
  Image,
  StyleSheet,
  Platform,
 } from 'react-native';
import {  createStackNavigator, createAppContainer } from 'react-navigation';

const assetDir = '../../../assets';

// View Stack
import TabBarController from './TBController';

import LVMainView from "../../../src/components/Views/Pages/PCMainView";
import LVUserRole from "../../../src/components/Views/Pages/PCUserRole";
import LVLogin from "../../../src/components/Views/Pages/PCLogin";
import LVSignup from "../../../src/components/Views/Pages/PCSignup";
import ErrorView from '../../../src/components/Views/Structure/Widgets/ErrorDialog';
import SpinnerView from '../../../src/components/Views/Structure/Widgets/SpinnerDialog';

import Global from "../../../src/global.js";
import Debug from "../../../src/util/debug.js";
import User from "../../../src/modals/user/user.js";
import Dish from "../../../src/modals/menu/dish/dish.js";
import OrderDetails from '../Views/Pages/PCOrderDetails';
import DishDetails from '../Views/Pages/PCDishDetails';



//Gloabl Header Themes
const gstyles = StyleSheet.create(Global.NavigationHeader(false));

const ChefThemeHeader = {
  header: (
    <View style={gstyles.TBHeader}>
      <View style={gstyles.TBHeaderLeft}>
      </View>
      <View style={gstyles.TBHeaderCenter}>
        <Image style={gstyles.TBHeaderImage} source={require(assetDir + '/images/logo-white-full-2/logo-white-full-2.png')} />
      </View>
      <View style={gstyles.TBHeaderRight}>
      </View>
    </View>
  )
};

const CustomerThemeHeader = {
  header: (
    <View style={[gstyles.TBHeader, { height: (Platform.OS == 'ios' ? 75 : 50), backgroundColor:'#F48666'}]}>
      <View style={gstyles.TBHeaderLeft}>
      </View>
      <View style={gstyles.TBHeaderCenter}>
        <Image style={[gstyles.TBHeaderImage, {width:110}]} source={require(assetDir + '/images/logo-white-full/logo-white-full.png')} />
      </View>
      <View style={gstyles.TBHeaderRight}>
      </View>
    </View>
  )
};


const MainThemeHeader = {
  headerStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
};

const LVNav = createAppContainer(createStackNavigator({

  //Views
  LVMainView: {
    screen: LVMainView,
    navigationOptions: MainThemeHeader,
  },

  LVUserRole: {
    screen: LVUserRole,
    //navigationOptions: MainThemeHeader,
  },

  LVSignup: {
    screen: LVSignup,
    navigationOptions: {
      ...MainThemeHeader,
      title: 'Sign Up',
    },
  },

  LVLogin: {
    screen: LVLogin,
    //navigationOptions: MainThemeHeader,
  },
}));


const TBCChefNav = createAppContainer(createStackNavigator({

  //Views
  TabBarController: {
    screen: TabBarController,
    navigationOptions: ChefThemeHeader
  },

  PCOrderDetails: {
    screen: OrderDetails,
    //navigationOptions: ChefThemeHeader,
  },
}));

const TBCCustNav = createAppContainer(createStackNavigator({

  // Views
  TabBarController: {
    screen: TabBarController,
    navigationOptions: CustomerThemeHeader,
  },

  PCDishDetails: {
    screen: DishDetails,
    //navigationOptions: CustomerThemeHeader,
  },

  PCOrderDetails: {
    screen: OrderDetails,
    //navigationOptions: ChefThemeHeader,
  },
}));



export default class Navigation extends React.Component {

  showErrorViewWithMessage = (errorViewMessage, options = {}) => {

    this.setState((prevState) => {

      let showSpinnerView = prevState.showSpinnerView;
      let spinnerViewRefreshState = prevState.spinnerViewRefreshState;
      if (prevState.showSpinnerView) {
        showSpinnerView = false;
        spinnerViewRefreshState = prevState.spinnerViewRefreshState + 1;
      }

      return {
        errorViewRefreshState: prevState.errorViewRefreshState + 1,
        showErrorView: true,
        errorViewMessage: errorViewMessage,
        errorViewOptions: options,

        spinnerViewRefreshState: spinnerViewRefreshState,
        showSpinnerView: showSpinnerView,
      };
    });
  }

  toggleSpinnerView = (presentDialog, type = 'fullscreen') => {

    this.setState((prevState) => {
      return {
        spinnerViewRefreshState: prevState.spinnerViewRefreshState + 1,
        showSpinnerView: presentDialog,
        spinnerViewType: type,
      };
    });
  }

  constructor(props) {
    super(props);

    let onload = <LVNav screenProps={{ login: props.login, onError: this.showErrorViewWithMessage, onSuccess: this.showErrorViewWithMessage, toggleSpinner: this.toggleSpinnerView }} />;
    if(props.onLoad == 'TBCNav')
    {
      if(props.user.role == 'chef') 
      {
        onload = (
          <View style={{ flex: 1 }}>
            <StatusBar barStyle='light-content' />
            <TBCChefNav screenProps={{ user: props.user, onError: this.showErrorViewWithMessage, onSuccess: this.showErrorViewWithMessage, toggleSpinner: this.toggleSpinnerView, logout: props.logout }} />
          </View>
        );
      }
      else if(props.user.role == 'customer') 
      {
        onload = (
          <View style={{ flex: 1 }}>
            <StatusBar barStyle='light-content' />
            <TBCCustNav screenProps={{ user: props.user, onError: this.showErrorViewWithMessage, onSuccess: this.showErrorViewWithMessage, toggleSpinner: this.toggleSpinnerView, logout: props.logout }} />
          </View>
        );
      }
    }

    this.state = {
      navigation: onload,
      showErrorView: false,
      errorViewMessage: '',
      errorViewRefreshState: 0,
      errorViewOptions: {},

      showSpinnerView: false,
      spinnerViewType: 'fullscreen',
      spinnerViewRefreshState: 0,
    };

    this.showErrorViewWithMessage.bind(this);
    this.toggleSpinnerView.bind(this);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ErrorView key={'errorView-' + this.state.errorViewRefreshState} text={this.state.errorViewMessage} showError={this.state.showErrorView} options={this.state.errorViewOptions} callback={() => {
          this.setState((prevState) => {
            return {
              errorViewRefreshState: prevState.errorViewRefreshState + 1,
              showErrorView: false,
              errorMessage: '',
            };
          });
        }} />
        <SpinnerView key={'spinnerView-' + this.state.spinnerViewRefreshState} type={this.state.spinnerViewType} showSpinner={this.state.showSpinnerView} />
        { this.state.navigation }
      </View>
    );
  }
}
