import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
 } from 'react-native';

const assetDir = '../../../../../../assets';

import Global from '../../../../../../src/global.js';


export default class LVInputItem extends React.Component {

  //
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      secure: props.secure,
    };

    this.passwordEyeIconComponent.bind(this);
    this.segueRightIconComponent.bind(this);
  }

  // Custom components
  passwordEyeIconComponent() {
    if (this.props.secure) {
      return (
        <TouchableOpacity onPress={() => {
          this.setState((prevState) => {
            return {
              secure: !prevState.secure,
            }
          });
        }}>
          <Image style={gstyles.passwordViewIcon} source={require(assetDir + '/images/password-eye-icon/password-eye-icon.png')} />
        </TouchableOpacity>
      )
    }
  }

  segueRightIconComponent() {
    if (this.props.hasSegue) {
      return <Image style={gstyles.segueIcon} source={require(assetDir + '/images/segue-right-icon/segue-right-icon.png')} />
    } else {
      return <View style={gstyles.segueIconPlaceHolder} ></View>
    }
  }


  render() {

    const { separator, keyboardType } = this.props;
    let { editable, options } = this.props;
    options = (options ? options : {});

    if (editable) {
      editable = true;
    }

    let separatorBorder = {};
    if (separator) {
      separatorBorder = { borderBottomWidth: 0.5, borderBottomColor: '#CFDAE0' };
    }

    return (
      <View style={[gstyles.container, separatorBorder, options.container]}>
        <View style={gstyles.rowWrapper}>
          <View style={[gstyles.contentColumnWrapper, options.contentColumnWrapper]}>
            <Text style={gstyles.title}>{this.props.title}</Text>
            <View style={gstyles.textInputWrapper}>
              <TextInput 
                style={[gstyles.textInput, options.textInput]} 
                placeholder={this.props.placeholder} 
                value={ this.state.value }
                placeholderTextColor={ this.props.placeholderTextColor } 
                secureTextEntry={this.state.secure} 
                keyboardType={keyboardType} 
                underlineColorAndroid={'#F16522'} 
                editable={editable}
                textAlign={this.props.textAlign}
                onChangeText={(text) => {
        
                  const sanitizedText = this.props.validator(text);
                  this.props.onChangeText(sanitizedText);
                  this.setState({
                    value: sanitizedText,
                  });
                }}
              />
              { this.passwordEyeIconComponent() }
            </View>
          </View>
          { this.segueRightIconComponent() }
        </View>
      </View>
    );
  }
}


const gstyles = StyleSheet.create(Global.LVInputItem());
