import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';


const assetDir = '../../../../../assets';

export default class ErrorDialog extends React.Component {

  constructor(props) {
    super(props);

    const initialTopPosition = Dimensions.get('window').height / 4;
    this.state = {

      slideIn: new Animated.Value(-initialTopPosition),
    };
  }
  
  componentDidMount() {

    if (this.props.showError) {

      const initialTopPosition = Dimensions.get('window').height / 4;
      Animated.timing(this.state.slideIn).stop();
      Animated.sequence([
        Animated.timing(this.state.slideIn, {

          toValue: 0,
          duration: 400,
          delay: 0,
        }),
        Animated.timing(this.state.slideIn, {

          toValue: -initialTopPosition,
          duration: 1000,
          delay: 1000 * 6,
        }),
      ]).start();
    }
  }

  componentWillUnmount() {

    const initialTopPosition = Dimensions.get('window').height / 4;
    Animated.timing(this.state.slideIn).stop();
    Animated.timing(this.state.slideIn, {

      toValue: -initialTopPosition,
      duration: 1000,
      delay: 0,
    }).start();
  }

  render() {

    if (this.props.showError) {

      let { options } = this.props;
      options = (options ? options : {});
      
      return (
        <Animated.View style={[styles.container, options.container, { top: this.state.slideIn }]}>
          <TouchableOpacity 
            style={styles.wrapper}
            onPress={() => {

              const initialTopPosition = Dimensions.get('window').height / 4;
              Animated.timing(this.state.slideIn).stop();
              Animated.timing(this.state.slideIn, {

                toValue: -initialTopPosition,
                duration: 500,
                delay: 0,
              }).start();
          }}>
            <Text style={styles.text}>{this.props.text}</Text>
            <Image style={styles.exitIcon} source={require(assetDir + "/images/white-exit-icon/white-exit-icon.png")} />
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return null;
  }
}


const styles = StyleSheet.create({

  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    padding: 10,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: '#E9333D',
    zIndex: 50,
  },

  wrapper: {

    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  text: {
    flex: 1,
    color: '#FFFFFF',
  },

  exitIcon: {
    flex: 0,
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
    marginLeft: 5,
  },

});
