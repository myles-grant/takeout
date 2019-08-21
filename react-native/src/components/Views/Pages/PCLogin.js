import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import Firebase from 'react-native-firebase';

const assetDir = '../../../../assets';

import User from '../../../../src/modals/user/user.js';
import Order from '../../../../src/modals/order/order.js';
import Dish from '../../../../src/modals/menu/dish/dish.js';
import Drink from '../../../../src/modals/menu/drink/drink.js';

import Validator from '../../../../src/util/validator.js';
import Ajax from '../../../../src/util/ajax.js';
import Global from '../../../../src/global.js';

export default class Login extends React.Component {

  static navigationOptions(props) {
    return {
      headerStyle: {
        backgroundColor: props.navigation.state.params.bgColor.backgroundColor,
        borderBottomWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: '#FFFFFF',
    };
  }

  //
  constructor(props) {
    super(props);

    let imageSrc = require(assetDir + '/images/chef-hat/chef-hat.png');
    if (props.navigation.state.params.role == 'customer') {
      imageSrc = require(assetDir + '/images/knife-fork/knife-fork.png');
    }

    this.state = {
      email: '',
      emailValid: false,
      password: '',
      passwordValid: false,
      imageSrc: imageSrc,
      secure: true,
    };
  }

  render() {

    let { options } = this.props;
    options = (options ? options : {});

    return (
      <KeyboardAvoidingView style={[styles.container, this.props.navigation.state.params.bgColor, options.container]} behavior="padding" enabled>
        <StatusBar barStyle="light-content" />
        <View style={styles.s1}>
          <Image style={styles.image} source={this.state.imageSrc} />
        </View>
        <View style={styles.s2}>
          <View style={styles.s2_1}>
            <View style={[styles.textInputWrapper, { borderTopLeftRadius: 3, borderTopRightRadius: 3, }]}>
              <TextInput
                style={styles.textInput} 
                placeholder="Email"
                value={ this.state.email } 
                keyboardType={'email-address'} 
                placeholderTextColor='#9A9A9A'
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                    emailValid: Validator.emailString(text, false), 
                  });
                }}  />
            </View>
            <View style={[styles.textInputWrapper, { flexDirection:'row', borderTopColor: '#CFDAE0', borderTopWidth: 0.5, }]}>
              <TextInput 
                style={styles.textInput} 
                placeholder="Password" 
                value={ this.state.password } 
                placeholderTextColor='#9A9A9A' 
                secureTextEntry={this.state.secure} 
                keyboardType={'default'} 
                onChangeText={(text) => {
                this.setState({ 
                  password: text,
                  passwordValid: Validator.passwordString(text, false),
                });
              }} />
              <TouchableOpacity onPress={() => {
                this.setState((prevState) => {
                  return {
                    secure: !prevState.secure,
                  }
                });
              }}>
                <Image style={styles.passwordViewIcon} source={require(assetDir + '/images/password-white-eye-icon/password-white-eye-icon.png')} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.buttonWrapper} 
              onPress={() => {

                // Send login request to server
                const { emailValid, passwordValid, email, password } = this.state;

                if (emailValid && passwordValid)
                {
                  let body = {
                    email: email.toLowerCase(),
                    password: password,
                    token: '',
                    login_chef_user: '',
                  };
                  
                  if (this.props.navigation.state.params.role == 'customer') {
                    body = {
                      email: email.toLowerCase(),
                      password: password,
                      token: '',
                      login_customer_user: '',
                    };
                  }

                  this.props.screenProps.toggleSpinner(true);
                  Ajax.fetchRequest({
                    method: 'POST',
                    body: body,
                    endpoint: '',
                  }).then((response) => {

                    if (Ajax.checkResponse(response)) {

                      // Authenticate firebase
                      Firebase.auth().signInWithEmailAndPassword(Global.FBUsername(), Global.FBPassword()).then((FBUser) => {

                        if (FBUser) {
                          // temp.. should already have user ready to save from response
                          // parse user from response
                          const returnData = response.return_data;
                          let user = {
                            id: parseInt(returnData.id),
                            rating: parseFloat(returnData.rating),
                            role: this.props.navigation.state.params.role,
                            name: returnData.name,
                            email: returnData.email,
                            phoneNumber: returnData.phone_number,
                            profile: { uri: returnData.profile_picture_base_64 },
                            token: returnData.token,
                            location: {
                              home: {
                                name: returnData.home_address,
                                lat: returnData.home_address_lat,
                                lon: returnData.home_address_lng,
                              },
                              work: {
                                name: returnData.work_address,
                                lat: returnData.work_address_lat,
                                lon: returnData.work_address_lng,
                              },
                            },
                            bank: {
                              name: '',
                              institution: '',
                              branch: '',
                              account: '',
                            },
                            certificate: {
                              dateIssued: '',
                              espDate: '',
                              certImgSrc: '',
                              location: {
                                name: 'Place Certificate Signed',
                                lat: 0.00,
                                lon: 0.00,
                              },
                            },
                            wallet: {
                              depositCycle: '',
                              amount: 0.00,
                              cps: 0.00,
                              rtd: 0.00,
                            },
                          };

                          if (this.props.navigation.state.params.role == 'chef') {
                            user = {
                              id: parseInt(returnData.id),
                              rating: 0,
                              role: this.props.navigation.state.params.role,
                              name: returnData.name,
                              email: returnData.email,
                              phoneNumber: returnData.phone_number,
                              profile: { uri: returnData.profile_picture_base_64 },
                              token: returnData.token,
                              location: {
                                home: {
                                  name: returnData.home_address,
                                  lat: parseFloat(returnData.home_address_lat),
                                  lon: parseFloat(returnData.home_address_lng),
                                },
                                work: {
                                  name: returnData.work_address,
                                  lat: parseFloat(returnData.work_address_lat),
                                  lon: parseFloat(returnData.work_address_lng),
                                },
                              },
                              bank: {
                                name: returnData.bank_name,
                                institution: returnData.bank_inst,
                                branch: returnData.bank_branch,
                                account: returnData.bank_account_number,
                              },
                              certificate: {
                                dateIssued: returnData.cert_date_issued,
                                espDate: returnData.cert_esp_date,
                                certImgSrc: { uri: returnData.cert_image_base_64 },
                                location: {
                                  name: 'Place Certificate Signed',
                                  lat: 0.00,
                                  lon: 0.00,
                                },
                              },
                              wallet: {
                                depositCycle: returnData.deposit_cycle,
                                amount: parseFloat(returnData.wallet).toFixed(2),
                                cps: 0.00,
                                rtd: 0.00,
                              },
                            };
                          }
                          // temp

                          // Set user
                          if (user != null)
                          {
                            if (user.role == 'chef')
                            {
                              // Add dishes
                              Dish.setDish(returnData.menu_items, user.role);

                              // Add drinks
                              Drink.setDrink(returnData.drinks);

                              // Add orders
                              Order.setOrder(returnData.orders);
                            }
                            else if (user.role == 'customer')
                            {
                              // Add dishes
                              Dish.setDish(returnData.menu_items, user.role);

                              // Add orders (order items)
                              Order.setOrder(returnData.orders, 'order', user);

                              // Add orders (cart items)
                              Order.setOrder(returnData.cart_items, 'cart', user);
                            }
                            
                            this.props.screenProps.toggleSpinner(false);
                            this.props.screenProps.login(user);
                          }  
                          else 
                          {
                            // Failed to save user
                            this.props.screenProps.onError('Could not login. Could not save user, please try again.');
                          }
                        }
                        else 
                        {
                          this.props.screenProps.onError('Could not login, please try again.');
                        }
                      });
                    }
                    else
                    {
                      // Error with response
                      const errorMessage = 'Could not login, please try again. '.concat(response.message);
                      this.props.screenProps.onError(errorMessage);
                    }
                  });
                }
                else
                {
                  this.props.screenProps.onError('Could not login, your email and or password is invalid.');
                }
              }}>
              <Text style={styles.button} >SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
  },

  scrollView: {
    flex: 1,
    justifyContent: 'center',
  },

  s1: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },


  image: {
    width: 150,
    resizeMode: 'contain',
  },

  s2: {
    flex: 2,
  },

  s2_1: {
    flex: 1,
  },

  textInputWrapper: {
    height: 50,
    backgroundColor: '#FFFFFF',
  },

  textInput: {
    flex: 1,
    color: 'rgb(69,69,69)',
    padding: 9,
  },

  buttonWrapper: {
    height: 55,
    marginTop: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9333D',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  button: {
    color: '#FFFFFF',
  },

  passwordViewIcon: {
    opacity: 0.5,
    width: 50,
    resizeMode: 'contain',
  },

});
