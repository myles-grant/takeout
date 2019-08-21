import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Button,
  Dimensions,
  FlatList,
 } from 'react-native';


const assetDir = '../../../../../assets';
const offset = 111;

export default class TBMain extends React.PureComponent {


  onTabBarItemPressed = () => {

    //Scroll to target view
    const { stateCache } = this.state;
    let viewWidth = Dimensions.get('window').width;
    let currentX = viewWidth * stateCache.initialView;
    let targetX = viewWidth * stateCache.targetView;
    this._flatList.scrollToOffset({
      offset: targetX,
      animated: true,
    });
  }

  //
  constructor(props) {
    super(props);

    let { stateCache } = props;
    if(stateCache == null)
    {
      stateCache = {
        initialView: 0,
        targetView: 0,
      };
    }

    this.state = {
      stateCache: stateCache,
    };

    this.onTabBarItemPressed.bind(this);
  }

  componentDidMount() {

    //Set initial view
    this.props.updateInitialView();
    let currentX = Dimensions.get('window').width * this.state.stateCache.initialView;
    this._flatList.scrollToOffset({
      offset: currentX,
      animated: false,
    });

    setTimeout(() => {
      this.onTabBarItemPressed();
    }, 100);
  }


  render() {

    return (
      <View style={styles.container}>
        <FlatList ref={scrollView => { this._flatList = scrollView; }} style={styles.offset} data={this.props.renderItems} renderItem={({item}) => {
            return (
              item.component({
                container: {
                  width:Dimensions.get("window").width},
                }
              )
            );
          }} pagingEnabled={true} horizontal={true} scrollEnabled={false} keyExtractor={(item, index) => index.toString()} />
      </View>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    top: offset, //push view down to achieve tabbar overlay effect
    height: Dimensions.get("window").height - 20, //Use screen height to get fullscreen since not only child component in parent tabbarcontroller
  },

  offset: {
    flex: 1,
    //top: -offset,
  },

});
