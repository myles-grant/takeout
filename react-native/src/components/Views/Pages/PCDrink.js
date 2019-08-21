import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';

import LVListItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListItem';
import LVListImageItem from '../../../../src/components/Views/Structure/Lists/LVItems/SCLVListImageItem';

import Validator from '../../../../src/util/validator.js';
import Global from '../../../../src/global.js'

import DrinkModal from '../../../../src/modals/menu/drink/drink.js';

const assetDir = '../../../../assets';

export default class Drink extends React.Component {


  //Funcs
  getDrinkItems = () => {


    const { drink } = this.state;
    const list = [
      {
        title: 'Sprite',
        component: (options) => {
          return (
            <View style={[styles.drinkItemContainer, { marginTop: (Platform.OS == 'ios' ? 75 : 100) }]}>
              <LVListImageItem 
                title={''}
                image={require(assetDir + '/images/drinks/sprite-logo-icon/sprite-logo-icon.png')}
                separator={false}
                options={{...options}}
              />
              <View style={styles.drinkPriceQtyContainer}>
                <View style={styles.drinkPriceContainer}>
                  <Text style={styles.drinkPriceText}>Price:</Text>
                  <TextInput
                    style={styles.drinkPriceInput}
                    placeholder={'$1.50'}
                    value={drink.sprite.price.toString()}
                    keyboardType={'decimal-pad'}
                    underlineColorAndroid={'#F16522'}
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.sprite.price = parseFloat(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
                <View style={styles.drinkQtyContainer}>
                <Text style={styles.drinkQtyText}>Quantity:</Text>
                  <TextInput
                    style={styles.drinkQtyInput} 
                    placeholder={'12'} 
                    value={drink.sprite.qty.toString()}
                    keyboardType={'number-pad'} 
                    underlineColorAndroid={'#F16522'} 
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.sprite.qty = parseInt(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            
          );
        }
      },
      {
        title: 'Coca Cola',
        component: (options) => {
          return (
            <View style={[styles.drinkItemContainer, { marginTop: 10 }]}>
              <LVListImageItem 
                title={''}
                image={require(assetDir + '/images/drinks/coke-logo-icon/coke-logo-icon.png')}
                separator={false}
                options={{...options}}
              />
              <View style={styles.drinkPriceQtyContainer}>
                <View style={styles.drinkPriceContainer}>
                  <Text style={styles.drinkPriceText}>Price:</Text>
                  <TextInput
                    style={styles.drinkPriceInput}
                    placeholder={'$1.50'}
                    value={drink.coke.price.toString()}
                    keyboardType={'decimal-pad'}
                    underlineColorAndroid={'#F16522'}
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.coke.price = parseFloat(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
                <View style={styles.drinkQtyContainer}>
                <Text style={styles.drinkQtyText}>Quantity:</Text>
                  <TextInput
                    style={styles.drinkQtyInput} 
                    placeholder={'12'} 
                    value={drink.coke.qty.toString()}
                    keyboardType={'number-pad'} 
                    underlineColorAndroid={'#F16522'} 
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.coke.qty = parseInt(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            
          );
        }
      },
      {
        title: 'IceTea',
        component: (options) => {
          return (
            <View style={[styles.drinkItemContainer, { marginTop: 10 }]}>
              <LVListImageItem 
                title={''}
                image={require(assetDir + '/images/drinks/icetea-logo-icon/icetea-logo-icon.png')}
                separator={false}
                options={{...options}}
              />
              <View style={styles.drinkPriceQtyContainer}>
                <View style={styles.drinkPriceContainer}>
                  <Text style={styles.drinkPriceText}>Price:</Text>
                  <TextInput
                    style={styles.drinkPriceInput}
                    placeholder={'$1.50'}
                    value={drink.icetea.price.toString()}
                    keyboardType={'decimal-pad'}
                    underlineColorAndroid={'#F16522'}
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.icetea.price = parseFloat(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
                <View style={styles.drinkQtyContainer}>
                <Text style={styles.drinkQtyText}>Quantity:</Text>
                  <TextInput
                    style={styles.drinkQtyInput} 
                    placeholder={'12'} 
                    value={drink.icetea.qty.toString()}
                    keyboardType={'number-pad'} 
                    underlineColorAndroid={'#F16522'} 
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.icetea.qty = parseInt(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            
          );
        }
      },
      {
        title: 'Fanta',
        component: (options) => {
          return (
            <View style={[styles.drinkItemContainer, { marginTop: 10 }]}>
              <LVListImageItem 
                title={''}
                image={require(assetDir + '/images/drinks/fanta-logo-icon/fanta-logo-icon.png')}
                separator={false}
                options={{...options}}
              />
              <View style={styles.drinkPriceQtyContainer}>
                <View style={styles.drinkPriceContainer}>
                  <Text style={styles.drinkPriceText}>Price:</Text>
                  <TextInput
                    style={styles.drinkPriceInput}
                    placeholder={'$1.50'}
                    value={drink.fanta.price.toString()}
                    keyboardType={'decimal-pad'}
                    underlineColorAndroid={'#F16522'}
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.fanta.price = parseFloat(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
                <View style={styles.drinkQtyContainer}>
                <Text style={styles.drinkQtyText}>Quantity:</Text>
                  <TextInput
                    style={styles.drinkQtyInput} 
                    placeholder={'12'} 
                    value={drink.fanta.qty.toString()}
                    keyboardType={'number-pad'} 
                    underlineColorAndroid={'#F16522'} 
                    editable={true}
                    onChangeText={(text) => {

                      let { drink } = this.state;
                      drink.fanta.qty = parseInt(text);

                      this.setState({
                        drink: drink,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
            
          );
        }
      },
      {
        title: 'Submit Data',
        component: (options) => { 
          return (
            <LVListItem 
              title={'Update'} 
              onPress={() => {

              }} 
              separator={true} 
              hasSegue={false} 
              options={{...options,
                container: [options.container, { borderRadius:3, borderBottomWidth:2, borderBottomColor:'#006738', borderRightColor:'#009344', marginTop: 20, marginBottom:105, backgroundColor:'#009344'}], 
                title: { alignSelf:'center', color:'#FFFFFF'} 
              }}  />
          )
        }
      },
    ];

    this.setState({
      listItems: list,
    })
  }

  //
  constructor(props) {
    super(props);

    const { user } = props;
    DrinkModal.getDrink().then(({loaded, state}) => {

      let drink = null;
      if(state != null) {
        drink = state;
      } else if (loaded != null) {
        drink = loaded;
      }

      this.setState({
        drink: drink,
      });

      // Set drinks
      this.getDrinkItems();
    });

    this.state = {
      listItems: [],
      refreshState: 0,
      drink: null,
    };

    this.getDrinkItems.bind(this);
  }

  render() {

    let { options } = this.props;
    options = (options ? options : {});

    return (
      <View style={[styles.container, options.container]}>
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
                image: {
                  width: 90,
                  height: 90,
                },
              })
            );
          }} />
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

  drinkItemContainer: {

    paddingLeft: 10,
    borderWidth: 0.5,
    borderRadius: 3,
    borderColor: '#CFDAE0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  drinkPriceQtyContainer: {

    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  drinkPriceContainer: {

    padding: 10,
  }, 

  drinkQtyContainer: {

    padding: 10,
  },

  drinkPriceText: {
    marginBottom: 9,
  },

  drinkQtyText: {
    marginBottom: 9,
  },

  drinkQtyInput: {

    textAlign: 'center',
  }

});

const gstyles = StyleSheet.create(Global.LVInputItem(false));
