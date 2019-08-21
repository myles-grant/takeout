import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';


const assetDir = '../../../../../assets';

export default class SpinnerDialog extends React.Component 
{
    spinSpinnerIcon = () => {
        
        this.state.rotate.setValue(0);
        Animated.timing(this.state.rotate, {

            toValue: 1,
            duration: 1500,
            easing: Easing.linear
        }).start(() => this.spinSpinnerIcon());
    }

    constructor(props) {
        super(props);

        const initialTopPosition = Dimensions.get('window').height / 4;
        this.state = {

            rotate: new Animated.Value(0),
        };

        this.spinSpinnerIcon.bind(this);
    }
    
    
    componentDidMount() {

        if (this.props.type == 'fullscreen') {
            this.spinSpinnerIcon();
        }
    }

    componentWillUnmount() {

        if (this.props.type == 'fullscreen') {
            Animated.timing(this.state.rotate).stop();
        }
    }

    render() {

        if (!this.props.showSpinner) {
            return null;
        }

        if (this.props.type == 'fullscreen') {

            const spin = this.state.rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
            });

            return (
                <View style={styles.container}>
                    <Animated.Image style={[styles.spinnerIcon, { transform: [{rotate: spin}] }]} source={require(assetDir + "/images/white-spinner-icon/white-spinner-icon.png")} />
                    <Text style={styles.text}>Loading, Please Wait...</Text>
                </View>
            );
        }

        return null;
    }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(88, 88, 91, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 49,
  },

  text: {
    color: '#FFFFFF',
  },

  spinnerIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    margin: 30,
  },

});
