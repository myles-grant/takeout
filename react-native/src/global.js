
import { Platform } from 'react-native';
import debug from '../src/util/debug.js';

export default {

  emptyUser() {
    return -1234567890;
  },

  emptyDish() {
    return 1234567890;
  },

  emptyDrink() {
    return 12134567890;
  },

  emptyOrder() {
    return -1234567890;
  },

  FBUsername() {
    return 'ihearttakeout1@gmail.com';
  },

  FBPassword() {
    return 'takeout123!';
  },

  HST_TAX_PERCENTAGE() {
    return 0.13;
  },

  /* GLOBAL STYLE FUNC START */

  LVItemContainer(style1 = {}, style2 = {container:{}}) {

    return { ...style1, ...style2 };
  },


  // LVInputItem styles
  LVInputItem(debugMode) {
    let _debugMode = false;
    if (debugMode) {
      _debugMode = true;
    }

    return {

      container: {
        flex: 1,
        padding: 15,
        backgroundColor: debug.layoutColor(_debugMode, '#FFFFFF', 0),
      },

      rowWrapper: {
        flex: 1,
        flexDirection: 'row',
      },

      contentColumnWrapper: {
        flex: 1,
      },


      title: {
        flex: 1,
        backgroundColor: debug.layoutColor(_debugMode, '', 1),
      },

      textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: debug.layoutColor(_debugMode, '', 2),
      },

      textInput: {
        flex: 1,
        padding: 10,
        paddingLeft: 0,
        backgroundColor: debug.layoutColor(_debugMode, '', 3),
      },

      passwordViewIcon: {
        width: 50,
        resizeMode: 'contain',
        backgroundColor: debug.layoutColor(_debugMode, '', 4),
      },

      segueIcon: {
        width: 10,
        resizeMode: 'contain',
        backgroundColor: debug.layoutColor(_debugMode, '', 5),
      },

      segueIconPlaceHolder: {
        backgroundColor: debug.layoutColor(_debugMode, '', 6),
      },
    };
  },

  NavigationHeader(debugMode) {
    let _debugMode = false;
    if (debugMode) {
      _debugMode = true;
    }
    return {

      TBHeader: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: (Platform.OS == 'ios' ? 20 : 0),
        height: 65,
        borderBottomWidth: 1,
        borderBottomColor: '#BE5D31',
        flexDirection: 'row',
        backgroundColor: debug.layoutColor(_debugMode, '#F16522', 0),
      },

      TBHeaderLeft: {
        flex: 0.5,
        backgroundColor: debug.layoutColor(_debugMode, '', 1),
      },

      TBHeaderRight: {
        flex: 0.5,
        backgroundColor: debug.layoutColor(_debugMode, '', 2),
      },

      TBHeaderCenter: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: debug.layoutColor(_debugMode, '', 3),
      },

      TBHeaderImage: {
        resizeMode: 'contain',
        width: 180,
        backgroundColor: debug.layoutColor(_debugMode, '', 4),
      },
    };
  },

  /* GLOBAL STYLE FUNC END */

};
