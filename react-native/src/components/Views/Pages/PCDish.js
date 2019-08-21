import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  Text,
  FlatList,
  Alert,
  DatePickerAndroid,
  DatePickerIOS,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

import ImagePicker from 'react-native-image-picker'; 
import LVInputItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVInputItem';
import LVListItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListItem';

import Validator from '../../../../src/util/validator.js';
import Global from '../../../../src/global.js'

import DishModal from '../../../../src/modals/menu/dish/dish.js';


const assetDir = '../../../../assets';

export default class Dish extends React.Component {

  //Funcs
  getDishItems = (dish, user) => {

    return [
      {
        title: 'Profile',
        value: dish.photo,
        component: (options) => {
          return (
            <TouchableOpacity style={[styles.dishPhotoImageContainer, options.container]} onPress={() => {

              this.getImagePicker();
            }}>
              <Image style={styles.dishPhotoImage} source={dish.photo} />
              <Text style={styles.uploadPhotoImageText}>Upload a photo of your dish</Text>
            </TouchableOpacity>
          );
        }
      },
      {
        title: 'Dish Name',
        value: dish.name,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Name of Dish:'} 
              value={dish.name} 
              placeholder={'Name'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.regString} 
              onChangeText={(value) => { 
                dish.name = value; 
                this.setState({ dish: dish }); 
              }} 
              secure={false} 
              keyboardType='default' 
              separator={true} 
              hasSegue={false}
              options={{...options}} 
              user={user} /> 
          )}
      },
      {
        title: 'Dish Description',
        value: dish.description,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Description:'} 
              value={dish.description} 
              placeholder={'Describe the dish'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.regString} 
              onChangeText={(value) => { 
                dish.description = value; 
                this.setState({ dish: dish }); 
              }} 
              secure={false}
              keyboardType='default' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={user} /> 
          )}
      },
      {
        title: 'Dish Start Time',
        value: dish.start_time,
        component: (options) => { 

          if (Platform.OS == 'android') {

            return (
              <LVInputItem 
                title={'Dish Start Time:'} 
                value={dish.description} 
                placeholder={'12:00 AM'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  dish.start_time = value; 
                  this.setState({ dish: dish }); 
                }} 
                secure={false}
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={user} /> 
            )
          }

          return (
            <View style={[gstyles.container, options.container]}>
              <View style={gstyles.rowWrapper}>
                <View style={gstyles.contentColumnWrapper}>
                  <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                    const { user, dish } = this.state;
                    const items = this.getDishItems(dish, user);

                    this.setState((prevState) => {
                      return {
                        presentTimePicker: 'start-time',
                        listItems: items,
                        refreshState: prevState.refreshState + 1,
                      }
                    });

                  }}>
                    <Text style={[gstyles.textInput, styles.textInput]}>{dish.start_time}</Text>
                    <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/clock-icon/clock-icon.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }
      },
      {
        title: 'Dish End Time',
        value: dish.end_time,
        component: (options) => { 

          if (Platform.OS == 'android') {

            return (
              <LVInputItem 
                title={'Dish End Time:'} 
                value={dish.description} 
                placeholder={'5:00 PM'} 
                placeholderTextColor={'#9A9A9A'} 
                validator={Validator.regString} 
                onChangeText={(value) => { 
                  dish.end_time = value; 
                  this.setState({ dish: dish }); 
                }} 
                secure={false}
                keyboardType='default' 
                separator={true} 
                hasSegue={false} 
                options={{...options}} 
                user={user} /> 
            )
          }


          return (
            <View style={[gstyles.container, options.container]}>
              <View style={gstyles.rowWrapper}>
                <View style={gstyles.contentColumnWrapper}>
                  <TouchableOpacity style={[gstyles.textInputWrapper, styles.homeAddressWrapper]} onPress={() => {

                    const { user, dish } = this.state;
                    const items = this.getDishItems(dish, user);

                    this.setState((prevState) => {
                      return {
                        presentTimePicker: 'end-time',
                        listItems: items,
                        refreshState: prevState.refreshState + 1,
                      }
                    });

                  }}>
                    <Text style={[gstyles.textInput, styles.textInput]}>{dish.end_time}</Text>
                    <Image style={[gstyles.passwordViewIcon, styles.locationIcon]} source={require(assetDir + '/images/clock-icon/clock-icon.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }
      },
      {
        title: 'Price',
        value: dish.price,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Price:'} 
              value={dish.price} 
              placeholder={'$12.00'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.priceString} 
              onChangeText={(value) => { 
                dish.price = value; 
                this.setState({ dish: dish }); 
              }} 
              secure={false} 
              keyboardType='decimal-pad' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={user} /> 
          )}
      },
      {
        title: 'Quantity',
        value: dish.quantity,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Quantity:'} 
              value={dish.quantity} 
              placeholder={'20'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.numberString} 
              onChangeText={(value) => { 
                dish.quantity = value; 
                this.setState({ dish: dish }); 
              }} 
              secure={false} 
              keyboardType='number-pad' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={user} /> 
          )}
      },
      {
        title: 'Order Prep Time',
        value: dish.quantity,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Order Prep. Time (minutes):'} 
              value={dish.order_prep_time} 
              placeholder={'20 mins'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.numberString} 
              onChangeText={(value) => { 
                dish.quantity = value; 
                this.setState({ dish: dish }); 
              }} 
              secure={false} 
              keyboardType='number-pad' 
              separator={true} 
              hasSegue={false} 
              options={{...options}} 
              user={user} /> 
          )}
      },
      {
        title: 'Dish Tags',
        value: dish.tags,
        component: (options) => { 
          return (
            <LVInputItem 
              title={'Tags (5):'} 
              value={dish.tags} 
              placeholder={'#pizza #cheese'} 
              placeholderTextColor={'#9A9A9A'} 
              validator={Validator.regString} 
              onChangeText={(value) => { 
                dish.description = value; 
                this.setState({ dish: dish }); 
              }} 
              secure={false}
              keyboardType='default' 
              separator={true} 
              hasSegue={false} 
              options={{...options, container: {...options.container, marginBottom: 20, borderBottomWidth: 1, }}} 
              user={user} /> 
          )}
      },
      {
        title: 'Submit Data',
        value: dish,
        component: (options) => { 
          return (
            <LVListItem 
              title={(dish.id == Global.emptyDish() ? 'Submit' : 'Update')} 
              onPress={() => {

              }} 
              separator={true} 
              hasSegue={false} 
              options={{...options,
                container: [options.container, { borderRadius:3, borderBottomWidth:2, borderBottomColor:'#006738', borderRightColor:'#009344', marginBottom:105, backgroundColor:'#009344'}], 
                title: { alignSelf:'center', color:'#FFFFFF'} 
              }} 
              user={user} />
          )
        }
      },
    ];
  }

  //
  constructor(props) {
    super(props);

    const { user } = props;
    let { dish } = props;
    if (dish == null) {
      dish = DishModal.getEmptyDishObject();
    }

    const items = this.getDishItems(dish, user);

    this.state = {
      listItems: items,
      refreshState: 0,
      dish: dish,
      dishes: [],

      presentTimePicker: false,
      datePickerSelectedDate: new Date(),
    };

    this.getDishItems.bind(this);
    this.getTimePicker.bind(this);
    this.getImagePicker.bind(this);
  }

  getTimePicker(type) {

    if (Platform.OS == 'ios') {
      
      return (
        <View style={styles.datePickerIOSContainer}>
          <View style={styles.datePickerIOSWrapper}>
            <Button title={'Done'} onPress={() => {

              const { user, dish } = this.state;
              const items = this.getDishItems(dish, user);
  
              this.setState((prevState) => {
                return {
                  listItems: items,
                  refreshState: prevState.refreshState + 1,
                  dish: dish,
                  presentTimePicker: false,
                }
              });
            }} />
          </View>
          <DatePickerIOS
            style={styles.datePickerIOS}
            date={this.state.datePickerSelectedDate}
            mode={'time'}
            onDateChange={(selectedDate) => {

              let dish = this.state.dish;
              if (type == 'start-time') {
                dish.start_time = Validator.parseTwoDigitInteger(selectedDate.getHours()) + ':' + Validator.parseTwoDigitInteger(selectedDate.getMinutes()); 
              }
              else if (type == 'end-time') {
                dish.end_time = Validator.parseTwoDigitInteger(selectedDate.getHours()) + ':' + Validator.parseTwoDigitInteger(selectedDate.getMinutes()); 
              }
              
              this.setState({ 
                dish: dish, 
                datePickerSelectedDate: selectedDate,
              });
            }}
          />
        </View>

      );
    } 
    else if (Platform.OS == 'android') {
  
    }
  }

  getImagePicker(access = false) {

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

    //Get image picker controller
    ImagePicker.launchCamera({
      // title: 'Choose method',
      mediaType: 'photo',
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
        let { dish, user } = this.state;
        dish.photo = { uri: 'data:image/jpeg;base64,' + response.data };
        dish.photUri = response.uri;

        const items = this.getDishItems(dish, user);
        this.setState((prevState) => {
          return {
            listItems: items,
            refreshState: prevState.refreshState + 1,
            dish: dish,
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


  render() {

    const { dishes } = this.props;

    let { options } = this.props;
    options = (options ? options : {});

    let TimePicker = null;
    if (this.state.presentTimePicker !== false) {
      TimePicker = this.getTimePicker(this.state.presentTimePicker);
    }

    let view = (
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
    );

    if (dishes != undefined && dishes != null && dishes.length == 0) {
      view = (
        <View style={styles.emptyDishViewContainer}>
          <Image style={styles.emptyDishIcon} source={require(assetDir + '/images/empty-dish-icon/empty-dish-icon.jpg')} />
          <Text style={styles.emptyDishText}>No dishes, click to add you first dish!</Text>
        </View>
      );  
    }

    return (
      <View style={[styles.container, options.container]}>
        { view }
        { TimePicker }
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

  dishPhotoImageContainer: {
    flex: 1,
    marginTop: (Platform.OS == 'ios' ? 75 : 100),
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    borderTopWidth: 1,
    borderTopColor:'#CFDAE0'
  },

  dishPhotoImage: {
    height: 150,
    width: 150,
    padding: 5,
    marginBottom: 15,
    resizeMode: 'contain',
  },

  uploadPhotoImageText: {
    color: '#1D9BF6'
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

  emptyDishViewContainer: {

    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyDishText: {

    color: '#1D9BF6',
  },

  emptyDishIcon: {

    height: 100,
    width: 80,
    resizeMode: 'contain',
    opacity: 0.5,
  },  

});

const gstyles = StyleSheet.create(Global.LVInputItem(false));