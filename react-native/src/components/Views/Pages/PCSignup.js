import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  DatePickerAndroid,
  DatePickerIOS,
  Button,
  Dimensions,
  PermissionsAndroid
 } from 'react-native';

import ImagePicker from 'react-native-image-picker'; 
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Firebase from 'react-native-firebase';

const assetDir = '../../../../assets';

import LVInputItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVInputItem';
import LVListItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListItem';
import LVPaginatedItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVPaginatedItem';

import Validator from '../../../../src/util/validator.js';
import Global from '../../../../src/global.js'
import Ajax from '../../../../src/util/ajax.js';

import User from '../../../../src/modals/user/user.js';
import Order from '../../../../src/modals/order/order.js';
import Dish from '../../../../src/modals/menu/dish/dish.js';
import Drink from '../../../../src/modals/menu/drink/drink.js';

export default class Signup extends React.Component {

  //Funcs
  resetState = (page) => {

    let items = [];
    const tempUserData = this.state.tempUserData;
    if (tempUserData.role == 'chef') {
      items = this.chefItems(page, tempUserData);
    }
    else if (tempUserData.role == 'customer') {
      items = this.customerItems(tempUserData);
    }

    this.setState((prevState) => {

      return {
        listItems: items,
        refreshState: prevState.refreshState + 1,
      };
    });
  }

  
  chefItems = (page, tempUserData) => {

    let logoutItem = [{component: () => { return null }}];
    let updateItem = [{component: () => { return null }}];

    if (page != 'wallet') {
      updateItem = [{
        title: 'Update Data',
        value: tempUserData,
        component: (options) => { 

          return (
            <LVListItem 
              title={'Update'}
              separator={true} 
              hasSegue={false} 
              options={{...options, 
                container:[ options.container, { borderRadius:3, borderBottomWidth:2, borderBottomColor:'#006738', marginBottom:10, backgroundColor:'#009344' } ], 
                title: { alignSelf:'center', color:'#FFFFFF'}
              }} 
              user={tempUserData}  
              onPress={this.submitDataItemPressed} />
          );
        }
      }];
    }
    
    if (tempUserData.id != Global.emptyUser()) {
      logoutItem = [
        ...updateItem,
        {
          title: 'Logout',
          value: null,
          component: (options) => { 
            return (
              <LVListItem 
                title={'Logout'} 
                onPress={this.props.screenProps.logout} 
                separator={true} 
                hasSegue={false} 
                options={{...options, 
                  container: [options.container, { borderRadius:3, borderBottomWidth:2, borderBottomColor:'#9A1B22', borderRightColor:'#9A1B22', marginBottom: 105, backgroundColor:'#E9333D'}], 
                  title: { alignSelf:'center', color:'#FFFFFF'} 
                }} 
                user={tempUserData} />
            )
          }
        }
      ];
    }

    let items = [];
    if(page == "profile")
    {
      items = [
        {
          title: 'Profile',
          component: (options) => {
            return (
              <TouchableOpacity style={[styles.profileItemContainer, options.container, { marginTop: (tempUserData.id == Global.emptyUser() ? 0 : (Platform.OS == 'ios' ? 75 : 100)) }]} onPress={() => {
                this.getImagePicker();
              }}>
                <Image style={[styles.profileItemImg, (tempUserData.id == Global.emptyUser() ? {resizeMode: 'contain'} : (tempUserData.profile.uri == undefined ? {resizeMode: 'contain'} : { borderRadius: 75, resizeMode: 'cover'}))]} source={tempUserData.profile} />
                <Text style={styles.uploadProfileImgText}>Upload Profile Picture</Text>
              </TouchableOpacity>
            );
          }
        },
        {
          title: 'Name',
          value: tempUserData.name,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Name'} 
                value={tempUserData.name} 
                placeholder={'Name'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString}
                onChangeText={(value) => { 
                  tempUserData.name = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }} 
                secure={false} 
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )
          }
        },
        {
          title: 'Email',
          value: tempUserData.email,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Email'} 
                value={tempUserData.email} 
                placeholder={'Email'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.emailString} 
                onChangeText={(value) => { 
                  tempUserData.email = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }} 
                secure={false} 
                keyboardType='email-address' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )
          }
        },
        {
          title: 'Password',
          value: tempUserData.password,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Password'} 
                value={tempUserData.password} 
                placeholder={''} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.passwordString} 
                onChangeText={(value) => { 
                  tempUserData.password = value;
                  this.setState({ tempUserData: tempUserData });  
                }} 
                secure={true} 
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} />
          ); }
        },
        {
          title: 'Phone Number',
          value: tempUserData.phoneNumber,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Phone Number'} 
                value={tempUserData.phoneNumber} 
                placeholder={'416-123-4567'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.phoneNumberString} 
                onChangeText={(value) => { 
                  tempUserData.phoneNumber = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }} 
                secure={false} 
                keyboardType='phone-pad' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )}
        },
        {
          title: 'Home Address',
          component: (options) => {
            return (
              <View style={[gstyles.container, options.container]}>
                <View style={gstyles.rowWrapper}>
                  <View style={gstyles.contentColumnWrapper}>
                    <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                      // Google location lat lon
                      this.setState({
                        presentGoogleAutoCompleteController: page,
                      });
                    }}>
                      <Text style={[gstyles.textInput, styles.textInput]}>{tempUserData.location.home.name}</Text>
                      <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/location-icon/grey-location-icon.png')} />
                    </TouchableOpacity>
                  </View>
                  <Image style={[gstyles.segueIcon, styles.segueIcon]} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
                </View>
              </View>
            );
          }
        },
        {
          title: 'Paginated Item',
          component: (options) => {
            return (
              <LVPaginatedItem 
                prevPage={false} 
                separator={true} 
                nextEnabled={true} 
                prevEnabled={false} 
                options={{...options,
                  container:{ ...options.container, borderBottomWidth:1, borderBottomColor:'#CFDAE0', marginBottom:20 }
                }} 
                user={tempUserData}
                nextPage={{ title:'Bank.. ', onPress:() => {

                  if (tempUserData.id !== Global.emptyUser()) {
                    this.setState((prevState) => {

                      let presentDatePicker = prevState.presentDatePicker;
                      if (presentDatePicker !== false) {
                        presentDatePicker = false;
                      }
                      return {
                        presentDatePicker: presentDatePicker,
                      }
                    });
                    this.resetState('bank');
                    return;
                  }

                  if (Validator.regString(tempUserData.name, false)) {
                    if (Validator.emailString(tempUserData.email, false)) { 
                      if (Validator.passwordString(tempUserData.password, false)) {
                        if (Validator.phoneNumberString(tempUserData.phoneNumber, false)) {
                          if (Validator.regString(tempUserData.location.home.name, false) && Validator.latlngString(tempUserData.location.home.lat, false) && Validator.latlngString(tempUserData.location.home.lon, false)) {

                            this.setState((prevState) => {

                              let presentDatePicker = prevState.presentDatePicker;
                              if (presentDatePicker !== false) {
                                presentDatePicker = false;
                              }
                              return {
                                presentDatePicker: presentDatePicker,
                              }
                            });
                            this.resetState('bank');

                          } else {
                            this.props.screenProps.onError('There is a problem validating your home address location.');
                          }
                        } else {
                          this.props.screenProps.onError('There is a problem validating your phone number.');
                        }
                      } else {
                        this.props.screenProps.onError('There is a problem validating your password. Make sure your password is more than 6 characters.');
                      }
                    } else {
                      this.props.screenProps.onError('There is a problem validating your email.');
                    }
                  } else {
                    this.props.screenProps.onError('There is a problem validating your name.');
                  }
              }}}/>
            )
          }
        },
        ...logoutItem,
      ];
    }
    else if(page == "bank")
    {
      items = [
        {
          title: 'Bank Name',
          value: tempUserData.bank.name,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Bank Name'} 
                value={tempUserData.bank.name} 
                placeholder={'Name of Bank'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  tempUserData.bank.name = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }} 
                secure={false} 
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options, container:{...options.container, ...styles.profileItemContainer, padding: 15, marginTop: (tempUserData.id == Global.emptyUser() ? 0 : (Platform.OS == 'ios' ? 75 : 100))}}} 
                user={tempUserData} /> 
            )
          }
        },
        {
          title: 'Bank Institution',
          value: tempUserData.bank.institution,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Bank Institution'} 
                value={tempUserData.bank.institution} 
                placeholder={'Institution'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  tempUserData.bank.institution = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }} 
                secure={false} 
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )}
        },
        {
          title: 'Branch',
          value: tempUserData.bank.branch,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Branch'} 
                value={tempUserData.bank.branch} 
                placeholder={'Bank Branch'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  tempUserData.bank.branch = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }}
                secure={false} 
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} />
            )}
        },
        {
          title: 'Account',
          value: tempUserData.bank.account,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Account'} 
                value={tempUserData.bank.account} 
                placeholder={'Account #'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  tempUserData.bank.account = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }}
                secure={false} 
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )}
        },
        {
          title: 'Paginated Item',
          component: (options) => {
            return (
              <LVPaginatedItem 
                separator={false} 
                nextEnabled={true} 
                prevEnabled={true} 
                options={{...options, 
                  container: [options.container, { borderBottomWidth: 1, borderBottomColor:'#CFDAE0', marginBottom:20 }]
                }} 
                user={tempUserData}
                nextPage={{ title:'Certificates.. ', onPress:() => {

                  if (tempUserData.id !== Global.emptyUser()) {
                    this.setState((prevState) => {

                      let presentDatePicker = prevState.presentDatePicker;
                      if (presentDatePicker !== false) {
                        presentDatePicker = false;
                      }
                      return {
                        presentDatePicker: presentDatePicker,
                      }
                    });
                    this.resetState('cert');
                    return;
                  }

                  if (Validator.regString(tempUserData.bank.name, false)) {
                    if (Validator.regString(tempUserData.bank.institution, false)) {
                      if (Validator.regString(tempUserData.bank.branch, false)) {
                        if (Validator.regString(tempUserData.bank.account, false)) {

                          this.setState((prevState) => {

                            let presentDatePicker = prevState.presentDatePicker;
                            if (presentDatePicker !== false) {
                              presentDatePicker = false;
                            }
                            return {
                              presentDatePicker: presentDatePicker,
                            }
                          });
                          this.resetState('cert');

                        } else {
                          this.props.screenProps.onError('There is a problem validating your bank account number.');
                        }
                      } else {
                        this.props.screenProps.onError('There is a problem validating your bank branch.');
                      }
                    } else {
                      this.props.screenProps.onError('There is a problem validating your bank institution.');
                    }
                  } else {
                    this.props.screenProps.onError('There is a problem validating your bank name.');
                  }
                }}} 
                prevPage={{ title:' ..Profile', onPress:() => {

                  this.setState((prevState) => {

                    let presentDatePicker = prevState.presentDatePicker;
                    if (presentDatePicker !== false) {
                      presentDatePicker = false;
                    }
                    return {
                      presentDatePicker: presentDatePicker,
                    }
                  });
                  this.resetState('profile'); 
                }}} 
              />
            )
          }
        },
        ...logoutItem,
      ];
    }
    else if(page == "cert")
    {
      items = [
        {
          title: 'Date Issued',
          value: tempUserData.certificate.dateIssued,
          component: (options) => { 
            return (
              <View style={[gstyles.container, options.container, styles.profileItemContainer, { padding: 15, marginTop: (tempUserData.id == Global.emptyUser() ? 0 : (Platform.OS == 'ios' ? 75 : 100)) }]}>
                <View style={gstyles.rowWrapper}>
                  <View style={gstyles.contentColumnWrapper}>
                    <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                      this.setState({
                        presentDatePicker: 'dateIssued',
                      });
                      this.resetState('cert');
                    }}>
                      <Text style={[gstyles.textInput, styles.textInput]}>{tempUserData.certificate.dateIssued}</Text>
                      <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/calendar-icon/calendar-icon.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          }
        },
        {
          title: 'Esp Date',
          value: tempUserData.certificate.espDate,
          component: (options) => { 
            return (
              <View style={[gstyles.container, options.container]}>
                <View style={gstyles.rowWrapper}>
                  <View style={gstyles.contentColumnWrapper}>
                    <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                      this.setState({
                        presentDatePicker: 'espDate',
                      });
                      this.resetState('cert');
                    }}>
                      <Text style={[gstyles.textInput, styles.textInput]}>{tempUserData.certificate.espDate}</Text>
                      <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/calendar-icon/calendar-icon.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          }
        },
        {
          title: 'Placed Issed',
          component: (options) => {
            return (
              <View style={[gstyles.container, options.container]}>
                <View style={gstyles.rowWrapper}>
                  <View style={gstyles.contentColumnWrapper}>
                    <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                      //Google location lat lon
                      this.setState({
                        presentGoogleAutoCompleteController: page,
                      });
                    }}>
                      <Text style={[gstyles.textInput, styles.textInput]}>{tempUserData.certificate.location.name}</Text>
                      <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/location-icon/grey-location-icon.png')} />
                    </TouchableOpacity>
                  </View>
                  <Image style={[gstyles.segueIcon, styles.segueIcon]} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
                </View>
              </View>
            );
          }
        },
        {
          title: 'Paginated Item',
          component: (options) => 
          {
            let nextPage = { 
              title:'Wallet.. ', 
              onPress:() => {

                this.setState((prevState) => {

                  let presentDatePicker = prevState.presentDatePicker;
                  if (presentDatePicker !== false) {
                    presentDatePicker = false;
                  }
                  return {
                    presentDatePicker: presentDatePicker,
                  }
                });
                this.resetState('wallet');
              }
            };

            if (tempUserData.id == Global.emptyUser()) {
              nextPage = false;
            }

            return (
              <LVPaginatedItem 
                separator={true} 
                nextEnabled={true} 
                prevEnabled={true} 
                options={{...options, 
                  container: [options.container, { borderBottomWidth:1, borderBottomColor:'#CFDAE0', marginBottom:20 }]
                }} 
                user={tempUserData}
                nextPage={nextPage} 
                prevPage={{ title:' ..Bank', onPress:() => {

                  this.setState((prevState) => {

                    let presentDatePicker = prevState.presentDatePicker;
                    if (presentDatePicker !== false) {
                      presentDatePicker = false;
                    }
                    return {
                      presentDatePicker: presentDatePicker,
                    }
                  });
                  this.resetState('bank');
                }}} 
              />
            )
          }
        },
        ...logoutItem,
      ];
    }
    else if(page == "wallet")
    {
      items = [
        {
          title: 'Wallet',
          value: tempUserData.wallet.amount,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Wallet'} 
                value={tempUserData.wallet.amount} 
                placeholder={'Amount'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.numberString} 
                onChangeText={(value) => { 
                  tempUserData.wallet.amount = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }}
                secure={false} 
                keyboardType='numeric' 
                editable={false}
                separator={true} 
                hasSegue={false} 
                options={{...options, container:{...options.container, ...styles.profileItemContainer, padding: 15, marginTop: (tempUserData.id == Global.emptyUser() ? 0 : (Platform.OS == 'ios' ? 75 : 100))}}} 
                user={tempUserData} /> 
            )}
        },
        {
          title: 'Deposit Cycle',
          value: tempUserData.wallet.depositCycle,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Deposit Cycle'} 
                value={tempUserData.wallet.depositCycle} 
                placeholder={'Deposit Cycle'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  tempUserData.wallet.depositCycle = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }}
                secure={false} 
                keyboardType='default' 
                editable={false}
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )}
        },
        {
          title: 'Revenew to Date',
          value: tempUserData.wallet.rtd,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Revenew to Date'} 
                value={tempUserData.wallet.rtd} 
                placeholder={'Revenew to Date'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.numberString} 
                onChangeText={(value) => { 
                  tempUserData.wallet.rtd = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }}
                secure={false} 
                keyboardType='numeric' 
                editable={false}
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} />
            )}
        },
        {
          title: 'Current Period Sales',
          value: tempUserData.wallet.cps,
          component: (options) => { 
            return (
              <LVInputItem 
                title={'Current Period Sales'} 
                value={tempUserData.wallet.cps} 
                placeholder={'Current Period Sales'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.numberString}
                onChangeText={(value) => { 
                  tempUserData.wallet.cps = value; 
                  this.setState({ tempUserData: tempUserData }); 
                }} 
                secure={false} 
                keyboardType='numeric' 
                editable={false}
                separator={false} 
                hasSegue={false} 
                options={{...options}} 
                user={tempUserData} /> 
            )}
        },
        {
          title: 'Paginated Item',
          component: (options) => {
            return (
              <LVPaginatedItem 
                nextPage={false} 
                separator={true} 
                nextEnabled={false} 
                prevEnabled={true} 
                options={{...options,
                  container: [options.container, { borderBottomWidth: 1, borderBottomColor:'#CFDAE0', marginBottom:20 }]
                }} 
                user={tempUserData}
                prevPage={{ title:' ..Certificates', onPress:() => {

                  this.setState((prevState) => {

                    let presentDatePicker = prevState.presentDatePicker;
                    if (presentDatePicker !== false) {
                      presentDatePicker = false;
                    }
                    return {
                      presentDatePicker: presentDatePicker,
                    }
                  });
                  this.resetState('cert');
                }}} 
              />
            )
          }
        },
        ...logoutItem,
      ];
    }

    return items;
  }


  customerItems = (tempUserData) => {

    let logoutItem = [{component: () => { return null }}];
    if (tempUserData.id != Global.emptyUser()) {
      logoutItem = [{
        title: 'Logout',
        value: null,
        component: (options) => { 
          return (
            <LVListItem 
              title={'Logout'} 
              onPress={this.props.screenProps.logout} 
              separator={true} 
              hasSegue={false} 
              options={{...options, 
                container: [options.container, { borderRadius:3, borderBottomWidth:2, borderBottomColor:'#9A1B22', borderRightColor:'#9A1B22', marginBottom: 105, backgroundColor:'#E9333D'}], 
                title: { alignSelf:'center', color:'#FFFFFF'} 
              }} 
              user={tempUserData} />
          )
        }
      }];
    }

    return [
      {
        title: 'Profile',
        component: (options) => {
          return (
            <TouchableOpacity style={[styles.profileItemContainer, options.container, { marginTop: (tempUserData.id == Global.emptyUser() ? 0 : 10) }]} onPress={() => {

              this.getImagePicker();
            }}>
              <Image style={[styles.profileItemImg, (tempUserData.id == Global.emptyUser() ? {resizeMode: 'contain'} : (tempUserData.profile.uri == undefined ? {resizeMode: 'contain'} : { borderRadius: 75, resizeMode: 'cover'}) )]} source={tempUserData.profile} />
              <Text style={styles.uploadProfileImgText}>Upload Profile Picture</Text>
            </TouchableOpacity>
          );
        }
      },
      {
        title: 'Name',
        value: tempUserData.name,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Name'} 
              value={tempUserData.name} 
              placeholder={'Name'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.regString} 
              onChangeText={(value) => { 
                tempUserData.name = value; 
                this.setState({ tempUserData: tempUserData }); 
              }} 
              secure={false} 
              keyboardType='default' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={tempUserData} /> 
          )}
      },
      {
        title: 'Email',
        value: tempUserData.email,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Email'} 
              value={tempUserData.email} 
              placeholder={'Email'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.emailString} 
              onChangeText={(value) => { 
                tempUserData.email = value; 
                this.setState({ tempUserData: tempUserData }); 
              }} 
              secure={false} 
              keyboardType='email-address' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={tempUserData} /> 
          )}
      },
      {
        title: 'Password',
        value: '',
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Password'} 
              value={tempUserData.password} 
              placeholder={''} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.passwordString} 
              onChangeText={(value) => { 
                tempUserData.password = value; 
                this.setState({ tempUserData: tempUserData }); 
              }} 
              secure={true} 
              keyboardType='default' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={tempUserData} />
          )}
      },
      {
        title: 'Phone Number',
        value: tempUserData.phoneNumber,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Phone Number'} 
              value={tempUserData.phoneNumber} 
              placeholder={'416-123-4567'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.phoneNumberString} 
              onChangeText={(value) => { 
                tempUserData.phoneNumber = value; 
                this.setState({ tempUserData: tempUserData }); 
              }} 
              secure={false} 
              keyboardType='phone-pad' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={tempUserData} /> 
          )}
      },
      {
        title: 'Home Address',
        component: (options) => {
          return (
            <View style={[gstyles.container, options.container, { borderBottomWidth: 0.5, borderBottomColor:'#CFDAE0' }]}>
              <View style={gstyles.rowWrapper}>
                <View style={gstyles.contentColumnWrapper}>
                  <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                    //Google location lat lon
                    this.setState({
                      presentGoogleAutoCompleteController: 'home',
                    });
                  }}>
                    <Text style={[gstyles.textInput, styles.textInput]}>{tempUserData.location.home.name}</Text>
                    <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/location-icon/grey-location-icon.png')} />
                  </TouchableOpacity>
                </View>
                <Image style={[gstyles.segueIcon, styles.segueIcon]} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
              </View>
            </View>
          );
        }
      },
      {
        title: 'Work Address',
        component: (options) => {
          return (
            <View style={[gstyles.container, options.container, { borderBottomWidth: 1, borderBottomColor:'#CFDAE0', marginBottom:20 }]}>
              <View style={gstyles.rowWrapper}>
                <View style={gstyles.contentColumnWrapper}>
                  <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                    //Google location lat lon
                    this.setState({
                      presentGoogleAutoCompleteController: 'work',
                    });
                  }}>
                    <Text style={[gstyles.textInput, styles.textInput]}>{tempUserData.location.work.name}</Text>
                    <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/location-icon/grey-location-icon.png')} />
                  </TouchableOpacity>
                </View>
                <Image style={[gstyles.segueIcon, styles.segueIcon]} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
              </View>
            </View>
          );
        }
      },
      {
        title: 'Submit Data',
        value: tempUserData,
        component: (options) => { 
          return (
            <LVListItem 
              title={(tempUserData.id == Global.emptyUser() ? 'Submit' : 'Update')} 
              onPress={this.submitDataItemPressed} 
              separator={true} 
              hasSegue={false} 
              options={{...options, 
                container: [options.container, { borderRadius:3, borderBottomWidth:2, borderBottomColor:'#006738', borderRightColor:'#009344', marginBottom:10, backgroundColor:'#009344'}], 
                title: { alignSelf:'center', color:'#FFFFFF'} 
              }} 
              user={tempUserData} />
          )
        }
      },
      ...logoutItem,
    ];
  }


  submitDataItemPressed = () => {

    // Submit data to server
    // Check if all required fields are provided
    const tempUserData = this.state.tempUserData;
    if (tempUserData.role == 'chef')
    {
      if (Validator.regString(tempUserData.name, false)) {
        if (Validator.emailString(tempUserData.email, false)) { 
          if (Validator.passwordString(tempUserData.password, false)) {
            if (Validator.phoneNumberString(tempUserData.phoneNumber, false)) {
              if (Validator.regString(tempUserData.location.home.name, false) && Validator.latlngString(tempUserData.location.home.lat, false) && Validator.latlngString(tempUserData.location.home.lon, false)) {
                if (Validator.regString(tempUserData.bank.name, false)) {
                  if (Validator.regString(tempUserData.bank.institution, false)) {
                    if (Validator.regString(tempUserData.bank.branch, false)) {
                      if (Validator.regString(tempUserData.bank.account, false)) {

                        // Send user data to middle-tier
                        this.login();
                        
                      } else {
                        this.props.screenProps.onError('There is a problem validating your bank account number.');
                      }
                    } else {
                      this.props.screenProps.onError('There is a problem validating your bank branch.');
                    }
                  } else {
                    this.props.screenProps.onError('There is a problem validating your bank institution.');
                  }
                } else {
                  this.props.screenProps.onError('There is a problem validating your bank name.');
                }
              } else {
                this.props.screenProps.onError('There is a problem validating your home address location.');
              }
            } else {
              this.props.screenProps.onError('There is a problem validating your phone number.');
            }
          } else {
            this.props.screenProps.onError('There is a problem validating your password. Make sure your password is more than 6 characters.');
          }
        } else {
          this.props.screenProps.onError('There is a problem validating your email.');
        }
      } else {
        this.props.screenProps.onError('There is a problem validating your name.');
      }
    }
    else if (tempUserData.role == 'customer')
    {
      if (Validator.regString(tempUserData.name, false)) {
        if (Validator.emailString(tempUserData.email, false)) { 
          if (Validator.passwordString(tempUserData.password, false)) {
            if (Validator.phoneNumberString(tempUserData.phoneNumber, false)) {
              if (Validator.regString(tempUserData.location.home.name, false) && Validator.latlngString(tempUserData.location.home.lat, false) && Validator.latlngString(tempUserData.location.home.lon, false)) {
                if (Validator.regString(tempUserData.location.work.name, false) && Validator.latlngString(tempUserData.location.work.lat, false) && Validator.latlngString(tempUserData.location.work.lon, false)) {
                  
                  // Send user data to middle-tier
                  this.login();

                } else {
                  this.props.screenProps.onError('There is a problem validating your work address location.');
                }
              } else {
                this.props.screenProps.onError('There is a problem validating your home address location.');
              }
            } else {
              this.props.screenProps.onError('There is a problem validating your phone number.');
            }
          } else {
            this.props.screenProps.onError('There is a problem validating your password. Make sure your password is more than 6 characters.');
          }
        } else {
          this.props.screenProps.onError('There is a problem validating your email.');
        }
      } else {
        this.props.screenProps.onError('There is a problem validating your name.');
      }
    }
  }

  login = () => {
    
    this.props.screenProps.toggleSpinner(true);
    Firebase.auth().signInWithEmailAndPassword(Global.FBUsername(), Global.FBPassword()).then((FBUser) => {

      if (FBUser) {

        // Get FCM Token
        Firebase.messaging().hasPermission().then((accessGranted) => {
          if (accessGranted) {
            Firebase.messaging().getToken().then((token) => {
              this.login3(token);
            });
          } else {
            Firebase.messaging().requestPermission().then(() => {
              Firebase.messaging().getToken().then((token) => {
                 this.login3(token);
              });
            }).catch((error) => {
              this.props.screenProps.onError('Notification Access Not Granted: Takeout will not be able to send you any notifications.');
              this.login3();
            });
          }
        });

      } else {
        this.props.screenProps.onError('There is a problem validating your account, please try again.');
      }
    });
  }

  login3 = (token = '') => {
    const tempUserData = this.state.tempUserData;
    if ((tempUserData.profileUri == undefined || tempUserData.profileUri == null || (tempUserData.profileUri != undefined && tempUserData.profileUri != null && tempUserData.profileUri.length == 0)) && tempUserData.id != Global.emptyUser()) {
      // Don't upload profile photo
      this.login2(tempUserData.profile.uri, token);
      return;
    } else if ((tempUserData.profileUri == undefined || tempUserData.profileUri == null || (tempUserData.profileUri != undefined && tempUserData.profileUri != null && tempUserData.profileUri.length == 0)) && tempUserData.id == Global.emptyUser()) {

      this.login2('', token);
      return;
    }

    // // Upload profile photo to FBBucket
    const profileStoragePath = '/'.concat(tempUserData.role).concat('/profile/').concat(tempUserData.name).concat(tempUserData.email.replace('.', '')).concat('.png');
    Firebase.storage().ref(profileStoragePath).putFile(tempUserData.profileUri).then((FBStorageRef) => {

      if (FBStorageRef) {

        const downloadUrl = FBStorageRef.downloadURL;
        this.login2(downloadUrl, token);
      } else {
        this.props.screenProps.onError('There is a problem uploading your profile photo, please try again.');
      }
      
    }).catch((error) => {

      if (error) {
        this.props.screenProps.onError('There is a problem uploading your profile photo: '.concat(error));
      }
    });
  }


  login2 = (downloadUrl, token) => {

    // Send login request to server
    const tempUserData = this.state.tempUserData;
    let endpoint = (tempUserData.id == Global.emptyUser() ? {add_chef_user: ''} : {update_chef_user: '',  old_email: tempUserData.oldEmail.toLowerCase()});
    let body = {
      id: tempUserData.id,
      name: tempUserData.name,
      email: tempUserData.email.toLowerCase(),
      password: tempUserData.password,
      phone_number: tempUserData.phoneNumber,
      address: tempUserData.location.home.name,
      address_lat: tempUserData.location.home.lat,
      address_lng: tempUserData.location.home.lon,
      city: '',
      province_state: '',
      country: '',
      bank_name: tempUserData.bank.name,
      bank_inst: tempUserData.bank.institution,
      bank_branch: tempUserData.bank.branch,
      bank_account_number: tempUserData.bank.account,
      cert_date_issued: tempUserData.certificate.dateIssued,
      cert_esp_date: tempUserData.certificate.espDate,
      cert_place_issued: tempUserData.certificate.location.name,
      cert_image_base_64: '',
      profile_picture_base_64: downloadUrl,
      token: token,
      ...endpoint,
    };

    if (tempUserData.role == 'customer') {
      endpoint = (tempUserData.id == Global.emptyUser() ? {add_customer_user: ''} : {update_customer_user: '',  old_email: tempUserData.oldEmail.toLowerCase()});
      body = {
        id: tempUserData.id,
        name: tempUserData.name,
        email: tempUserData.email.toLowerCase(),
        password: tempUserData.password,
        phone_number: tempUserData.phoneNumber,
        home_address: tempUserData.location.home.name,
        home_address_lat: tempUserData.location.home.lat,
        home_address_lng: tempUserData.location.home.lon,
        work_address: tempUserData.location.work.name,
        work_address_lat: tempUserData.location.work.lat,
        work_address_lng: tempUserData.location.work.lon,
        payment_method: '',
        profile_picture_base_64: downloadUrl,
        token: token,
        ...endpoint,
      };
    }

    Ajax.fetchRequest({
      method: 'POST',
      body: body,
      endpoint: '',
    }).then((response) => {

      if (Ajax.checkResponse(response)) {
        // temp.. should already have user ready to save from response
        // parse user from response
        const returnData = response.return_data;
        let user = {
          id: parseInt(returnData.id),
          rating: parseFloat(returnData.rating),
          role: tempUserData.role,
          name: returnData.name,
          email: returnData.email,
          phoneNumber: returnData.phone_number,
          profile: { uri:returnData.profile_picture_base_64 },
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

        if (tempUserData.role == 'chef') {
          user = {
            id: parseInt(returnData.id),
            rating: parseFloat(returnData.rating),
            role: tempUserData.role,
            name: returnData.name,
            email: returnData.email,
            phoneNumber: returnData.phone_number,
            profile: { uri:returnData.profile_picture_base_64 },
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
              amount: returnData.wallet,
              cps: 0.00,
              rtd: 0.00,
            },
          };
        }
        // temp

        // Set user
        if (user != null)
        {
          this.props.screenProps.toggleSpinner(false);
          if (tempUserData.id == Global.emptyUser()) {
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

            this.props.screenProps.login(user);
          }
          else if (response.status && response.status == 'success' && response.message && response.message.length > 0 && tempUserData.id != Global.emptyUser()) {
            this.props.screenProps.onSuccess(response.message, { container:{backgroundColor: '#8AB560'}});
          }
        }  
        else 
        {
          // Failed to save user
          const errorMessage = (tempUserData.id == Global.emptyUser() ? 'Could not login. Could not save user, please try again.' : 'Could not update. Could not save user, please try again.');
          this.props.screenProps.onError(errorMessage);
        }
      }
      else
      {
        // Error with response
        const errorMessage = (tempUserData.id == Global.emptyUser() ? 'Could not login: '.concat(response.message) : 'Could not update your account: '.concat(response.message));
        this.props.screenProps.onError(errorMessage);
      }
    });
  }

  getImagePicker(access = false) {

    //Get image picker controller
    if (Platform.OS == 'android' && !access) {

      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {

        'title': 'Acceess Required.',
        'message': 'Takeout will require access to your camera and or photos for your profile image and or menu image usage.'
      }).then((access) => {

        if (access === PermissionsAndroid.RESULTS.GRANTED) {
          this.getImagePicker(true);
        } else {
          Alert.alert(
            "Access Denied",
            "You must grant Takeout access to your camera and or photos to set your profile image.",
            [
              {text: 'Okay', onPress: () => {}},
            ]
          );
        }

      });
    } else if (Platform.OS == 'ios') {
      access = true;
    }
    if (!access) { return; }

    ImagePicker.showImagePicker({
      title: 'Choose method',
      mediaType: 'video',
      allowsEditing: true,
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'takeout/images',
      // }
    }, (response) => {

      if(response.didCancel){
        return;
      }

      if(response.error == null && response.uri != null && response.data != null)
      {
        let tempUserData = this.state.tempUserData;
        tempUserData.profile = { uri: 'data:image/jpeg;base64,' + response.data };
        tempUserData.profileUri = response.uri;

        let items = [];
        if (tempUserData.role == 'chef') {
          items = this.chefItems('profile', tempUserData);
        }
        else if (tempUserData.role == 'customer') {
          items = this.customerItems(tempUserData);
        }

        this.setState((prevState) => {
          return {
            listItems: items,
            refreshState: prevState.refreshState + 1,
            tempUserData: tempUserData,
          };
        });
      }
      else
      {
        // Failed to fetch user image... alert to retry
        Alert.alert(
          "Image Failed",
          "There was a problem saving your image. Please try again.",
          [
            {text: 'Okay', onPress: () => {}},
          ]
        );
      }
    });
  }

  getLatLonCordinates(page) {

    return (
      <GooglePlacesAutocomplete
        placeholder='Enter Your Location'
        minLength={2} 
        autoFocus={true}
        returnKeyType={'search'} 
        listViewDisplayed='auto' 
        fetchDetails={true}
        onPress={(data, details = null) => { 
          
          if (details != null) 
          {
            let tempUserData = this.state.tempUserData;
            if (page == 'home' || page == 'profile') {
              tempUserData.location.home.name = details.formatted_address;
              tempUserData.location.home.lat = details.geometry.location.lat;
              tempUserData.location.home.lon = details.geometry.location.lng;
            } 
            else if (page == 'work') {
              tempUserData.location.work.name = details.formatted_address;
              tempUserData.location.work.lat = details.geometry.location.lat;
              tempUserData.location.work.lon = details.geometry.location.lng;
            }
            else if (page == 'cert') {
              tempUserData.certificate.location.name = details.formatted_address;
              tempUserData.certificate.location.lat = details.geometry.location.lat;
              tempUserData.certificate.location.lon = details.geometry.location.lng;
            }

            let items = [];
            if (tempUserData.role == 'chef') {
              items = this.chefItems(page, tempUserData);
            } 
            else if (tempUserData.role == 'customer') {
              items = this.customerItems(tempUserData);
            }

            this.setState((prevState) => {
              return {
                listItems: items,
                refreshState: prevState.refreshState + 1,
                tempUserData: tempUserData,
                presentGoogleAutoCompleteController: false,
              };
            }); 
          }
          else {

            // Failed to fetch user location.. alert user and try again
            Alert.alert(
              "Location Failed",
              "There was a problem saving your address. Please try again.",
              [
                {text: 'Okay', onPress: () => {}},
              ]
            );
          }
        }}
        
        query={{
          key: 'AIzaSyD41MrbQSPJM-QIFAbJ1zOrDVQ3dok4zkw',
          language: 'en',
        }}

        styles={{
          textInputContainer: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#000000',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
        }}

        currentLocation={false}
      />
    );
  }

  getDatePicker(type) {

    if (Platform.OS == 'ios') {
      
      return (
        <View style={styles.datePickerIOSContainer}>
          <View style={styles.datePickerIOSWrapper}>
            <Button title={'Done'} onPress={() => {

              let items = [];
              let tempUserData = this.state.tempUserData;
              if (tempUserData.role == 'chef') {
                items = this.chefItems('cert', tempUserData);
              } 
              else if (tempUserData.role == 'customer') {
                items = this.customerItems(tempUserData);
              }
  
              this.setState((prevState) => {
                return {
                  listItems: items,
                  refreshState: prevState.refreshState + 1,
                  tempUserData: tempUserData,
                  presentDatePicker: false,
                }
              });
            }} />
          </View>
          <DatePickerIOS
            style={styles.datePickerIOS}
            date={this.state.datePickerSelectedDate}
            mode={'date'}
            onDateChange={(selectedDate) => {

              let tempUserData = this.state.tempUserData;
              if (type == 'dateIssued') {
                tempUserData.certificate.dateIssued = Validator.parseTwoDigitInteger(parseInt(selectedDate.getMonth())+1) + '-' + Validator.parseTwoDigitInteger(selectedDate.getDate()) + '-' + selectedDate.getFullYear(); 
              }
              else if (type == 'espDate') {
                tempUserData.certificate.espDate = Validator.parseTwoDigitInteger(parseInt(selectedDate.getMonth())+1) + '-' + Validator.parseTwoDigitInteger(selectedDate.getDate()) + '-' + selectedDate.getFullYear(); 
              }
              
              this.setState({ 
                tempUserData: tempUserData, 
                datePickerSelectedDate: selectedDate,
              });
            }}
          />
        </View>

      );
    } 
    else if (Platform.OS == 'android') {

      DatePickerAndroid.open({
        date: this.state.datePickerSelectedDate,
        mode: 'spinner'
      }).then((selectedDate) => {

        if (selectedDate.action !== DatePickerAndroid.dismissedAction) {

          let tempUserData = this.state.tempUserData;
          if (type == 'dateIssued') {
            tempUserData.certificate.dateIssued = Validator.parseTwoDigitInteger(selectedDate.day) + '-' + Validator.parseTwoDigitInteger(parseInt(selectedDate.month)+1) + '-' + selectedDate.year; 
          }
          else if (type == 'espDate') {
            tempUserData.certificate.espDate = Validator.parseTwoDigitInteger(selectedDate.day) + '-' + Validator.parseTwoDigitInteger(parseInt(selectedDate.month)+1) + '-' + selectedDate.year; 
          }

          let items = [];
          if (tempUserData.role == 'chef') {
            items = this.chefItems('cert', tempUserData);
          } 
          else if (tempUserData.role == 'customer') {
            items = this.customerItems(tempUserData);
          }

          this.setState((prevState) => {
            return {
              listItems: items,
              refreshState: prevState.refreshState + 1,
              tempUserData: tempUserData,
              datePickerSelectedDate: new Date(selectedDate.year, selectedDate.month, selectedDate.day),
              presentDatePicker: false,
            }
          });
        }
      });
    }
  }


  //
  constructor(props) {
    super(props);

    let tempUserData = props.user;
    if(tempUserData == null) {
      tempUserData = User.getEmptyUserObject();
      tempUserData.role = props.navigation.state.params.role;
    }
    // Check: Profile value may be empty
    else if (tempUserData.profile.uri != undefined && tempUserData.profile.uri != null && tempUserData.profile.uri.length == 0) {
      tempUserData.profile = User.getEmptyUserObject().profile;
    }
    

    let items = [];
    if(tempUserData.role == "chef")
    {
      items = this.chefItems('profile', tempUserData);
    }
    else if(tempUserData.role == "customer")
    {
      items = this.customerItems(tempUserData);
    }

    tempUserData.oldEmail = tempUserData.email;
    this.state = {
      listItems: items,
      refreshState: 0,

      tempUserData: tempUserData,
      presentGoogleAutoCompleteController: false,
      presentDatePicker: false,
      datePickerSelectedDate: new Date(),
    };

    this.resetState.bind(this);
    this.getImagePicker.bind(this);
    this.getLatLonCordinates.bind(this);
    this.chefItems.bind(this);
    this.customerItems.bind(this);
    this.submitDataItemPressed.bind(this);
    this.login.bind(this);
    this.login2.bind(this);
    this.login3.bind(this);
    this.getDatePicker.bind(this);
  }


  render() {

    if (this.state.presentGoogleAutoCompleteController !== false) { 
      return this.getLatLonCordinates(this.state.presentGoogleAutoCompleteController); 
    }

    let DatePicker = null;
    if (this.state.presentDatePicker !== false) {
      DatePicker = this.getDatePicker(this.state.presentDatePicker);
    }

    let statusBar = <StatusBar barStyle="light-content" />;
    if (this.state.tempUserData.id == Global.emptyUser() && Platform.OS != 'android') {
      statusBar = <StatusBar barStyle="dark-content" />;
    } 
    
    let { options } = this.props;
    options = (options ? options : {});

    return (
      <View style={[styles.container, options.container]}>
        { statusBar }
        <FlatList 
          key={this.state.refreshState} 
          ref={ scrollView => { this._flatList = scrollView; }} 
          style={styles.flatlist} 
          data={this.state.listItems} 
          showsVerticalScrollIndicator={false}  
          keyExtractor={(item, index) => index.toString() } 
          renderItem={({item}) => {

            return (
              item.component({
                container: {
                  borderRightWidth: 1,
                  borderRightColor: '#CFDAE0',
                  borderLeftWidth: 1,
                  borderLeftColor: '#CFDAE0',
                }
              })
            );
          }} />
          { DatePicker }
      </View>
    );

  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 8,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },

  flatlist: {
  },

  textInput: {
  },

  profileItemContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    borderTopWidth: 1,
    borderTopColor:'#CFDAE0'
  },

  profileItemImg: {
    height: 150,
    width: 150,
    padding: 5,
    marginBottom: 15,
  },

  uploadProfileImgText: {
    color: '#1D9BF6'
  },


  homeAddressWrapper: {
    alignItems: 'center',
  },

  datePickerIOSContainer: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    marginLeft: -10,
  },  

  datePickerIOSWrapper: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#CFDAE0',
    borderBottomWidth: 1,
    borderBottomColor: '#CFDAE0',
  },  

  datePickerIOS: {
  },

  locationIcon: {
    height: 25,
  },

  segueIcon: {
    opacity: 0.5,
  },

  footerContainer: {
    borderBottomWidth:2,
    borderBottomColor:'#CFDAE0',
    marginBottom:105,
  },

});


const gstyles = StyleSheet.create(Global.LVInputItem(false));
