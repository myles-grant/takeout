import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
 } from 'react-native';


const assetDir = '../../../../../assets';

export default class Rating extends React.Component {

  render() {

    const { score } = this.props;

    if (score == 0) {
      return (
        <Text style={styles.noRatings}>No Ratings</Text>
      );
    } else if(score == 5) {
      return (
        <View style={styles.container}>
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
        </View>
      );
    } else if(score == 4) {
      return (
        <View style={styles.container}>
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
        </View>
      );
    } else if(score == 3) {
      return (
        <View style={styles.container}>
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
        </View>
      );
    } else if(score == 2) {
      return (
        <View style={styles.container}>
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
        </View>
      );
    } else if(score == 1) {
      return (
        <View style={styles.container}>
          <Image style={styles.star} source={require(assetDir + "/images/star-active-icon/star-active-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
          <Image style={styles.star} source={require(assetDir + "/images/star-unactive-icon/star-unactive-icon.png")} />
        </View>
      );
    } else {
      // Error 
      return (
        <Text style={styles.noRatings}>No Ratings</Text>
      );
    }
  }  
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },

  noRatings: {
    flex: 1,
    color: '#939597',
  },

  star: {
    width: 15,
    height: 15,
    marginRight: 3,
    resizeMode: 'contain',
  },

});